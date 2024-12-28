import {Component, OnInit} from '@angular/core';

import jsPDF from 'jspdf';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory
} from "@google/generative-ai";

import {environment} from "../../../environments/environment.development";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.css'
})
export class TicketDetailsComponent implements OnInit {
  order: any;
  loading = true;
  geminiResponseHtml: string = '<p>Loading recommendations...</p>';
  geminiResponse: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,) {
  }

  ngOnInit(): void {
    if (this.loading) {
      this.authService.showLoadingSpinner('Loading ticket details...');
    }
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      this.fetchOrderDetails(orderId);
    }
  }

  fetchOrderDetails(orderId: string): void {
    this.http.get(`http://localhost:5289/api/Orders/${orderId}`).subscribe(
      (data) => {
        this.order = data;
        this.responseGemini();
      },
      (error) => {
        console.error('Error fetching order details:', error);
        this.loading = false;
        this.authService.hideLoadingSpinner();
      }
    );
  }

  generatePDF(): void {
    const doc = new jsPDF();

    const sortedTickets = this.order.tickets.sort((a: any, b: any) => {
      const routeA = `${a.routeName} - ${a.routeName}`.toLowerCase();
      const routeB = `${b.routeName} - ${b.routeName}`.toLowerCase();
      return routeA.localeCompare(routeB);
    });
    sortedTickets.forEach((ticket: any, index: number) => {
      // Draw header background (black rectangle)
      doc.setFillColor(0, 0, 0); // Black color
      doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F'); // Full-width rectangle

      // Add logo to the header (left side)
      const logoImage = '/assets/logo.png'; // Replace with your logo path (base64 or URL)
      doc.addImage(logoImage, 'PNG', 10, 5, 20, 20); // Positioned at (x: 10, y: 5) with size (20x20)

      // Add title to the header (centered)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255); // White text color
      doc.text('Boleto de Viaje', doc.internal.pageSize.width / 2, 18, {align: 'center'});

      // Ticket information
      const startY = 40; // Start below header
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Black text
      doc.text(`Boleto ${index + 1}`, 10, startY);
      doc.setFontSize(12);
      doc.text(`Asiento: ${ticket.seatNumber}`, 10, startY + 10);
      doc.text(`Ruta: ${ticket.routeName}`, 10, startY + 20);

      // Add QR code in the center
      const qrImage = 'data:image/png;base64,' + ticket.qrCode;
      const qrX = (doc.internal.pageSize.width - 100) / 2; // Center horizontally
      doc.addImage(qrImage, 'PNG', qrX, startY + 30, 100, 100);

      // Footer
      const pageHeight = doc.internal.pageSize.height || 297; // A4 Page height
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50); // Gray text color
      doc.text('Contacto: soporte@empresa.com | Teléfono: +123 456 789', doc.internal.pageSize.width / 2, pageHeight - 20, {
        align: 'center'
      });
      doc.text('¡Buen viaje!', doc.internal.pageSize.width / 2, pageHeight - 10, {align: 'center'});

      // Add new page for next ticket, if not the last ticket
      if (index < this.order.tickets.length - 1) {
        doc.addPage();
      }
    });

    // Save PDF
    doc.save('boletos_de_viaje.pdf');
  }


  public async responseGemini(): Promise<void> {
    const destination = this.order.tickets[0]?.routeName.split(' - ')[1];
    const prompt = `I'll visit ${destination}
    in the next days, can you tell me places to visit?. Only plain text, no more than 5 places but with their description. No more than 80 words. Always enumerate the places.`;

    try {
      const genAI = new GoogleGenerativeAI(environment.API_KEY);
      const generationConfig = {
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
        temperature: 0.9,
        top_p: 1,
        top_k: 32,
        maxOutputTokens: 100,
      };

      const model = genAI.getGenerativeModel({
        model: 'gemini-pro',
        ...generationConfig,
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      this.geminiResponseHtml = this.formatResponseAsHtmlList(response.text());

      this.loading = false;

      this.authService.hideLoadingSpinner();
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      this.geminiResponse = 'No se pudo obtener información sobre lugares para visitar.';
    }

  }


  formatResponseAsHtmlList(response: string): string {
    const lines = response.split(/\r?\n/).filter(line => line.trim() !== '');

    const listItems = lines.map(line => {
      const cleanLine = line
        .replace(/^\*?\s?-?\s?/, '') // Elimina asteriscos o guiones al inicio
        .replace(/\*\*/g, '') // Elimina los asteriscos dobles
        .trim(); // Elimina espacios extra

      const formattedLine = cleanLine.replace(/^(.*?):/, '<b>$1</b>:');
      return `<li class="mb-3">${formattedLine}</li>`;

    });

    return `<ul class="list-disc pl-6">${listItems.join('')}</ul>`;
  }
}
