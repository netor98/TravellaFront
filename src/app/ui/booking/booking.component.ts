import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "../../services/booking-service.service";
import {AuthService} from "../../services/auth.service";
import {OverlayPanel} from "primeng/overlaypanel";
import {FormBuilder, Validators} from "@angular/forms";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory
} from "@google/generative-ai";
import {environment} from "../../../environments/environment.development";
import Swal from "sweetalert2";


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  tripDetails: any; // The trip to be booked
  email: string = '';
  selectedUser: any = null;
  selectedOption: number = 0;
  isCreatingNewUser: boolean = false;
  departureDate: string | undefined;
  isLoading: boolean = false;
  titleText = 'Thank you for your purchase!';
  options: any[] = [
    {
      id: 0,
      name: 'Select passenger'
    },
  ]

  public form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required, Validators.minLength(6)]],
    seats: [0, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService
  ) {
  }


  ngOnInit(): void {
    this.isLoading = true;
    this.tripDetails = this.bookingService.getTrip();

    this.selectedUser = this.authService.currentUser()();
    if (!this.tripDetails) {
      console.error('No trip details found. Redirecting...');
      this.router.navigate(['/search']);
    } else {
      this.departureDate = new Date(this.tripDetails.departureTime).toLocaleString();
      console.log(this.departureDate)
    }

    if (this.selectedUser) {
      this.options = [
        {
          id: 0,
          name: 'Create new passenger'
        },
        {
          id: 1,
          name: this.selectedUser.name
        }
      ]
    } else {
      this.options = [
        {
          id: 0,
          name: 'Create new passenger'
        }
      ]
    }

    setTimeout(() => {

      this.isLoading = false;
    }, 1500)
  }

  public typeText(element: HTMLElement | null, text: string, speed: number): void {
    if (!element) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        element.innerText += text[index];
        index++;
      } else {
        clearInterval(interval); // Stop typing when complete
      }
    }, speed);
  }


  public async submitBooking() {
    this.authService.showLoadingSpinner('Booking your trip...');

   /** */

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

    const prompt = `I'll visit ${this.tripDetails.route.destination.name}
    in the next days, can you tell me places to visit?. only plain text, and no more than 5 places but with their description. no more than 80 words `;
    const result = await model.generateContent(prompt);

    const response = await result.response;

    const responseText = response.text();

    const textPlain = this.removeAsteriks(responseText);

    const formattedResponse = this.formatResponse(textPlain);

    console.log(formattedResponse);
    this.authService.hideLoadingSpinner();

    Swal.fire({
      html: formattedResponse,
      icon: 'success',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'bg-white rounded-lg shadow-lg',
        title: 'text-lg font-semibold text-gray-700 mb-4',
        htmlContainer: 'text-gray-600 text-sm',
      }
    });

    const typingTextElement = document.getElementById('typing-text');
    this.typeText(typingTextElement, this.titleText, 100);

    const {email, fullName, seats} = this.form.value;

  }

  public onSeatSelection(seatNumber: number): void {
    this.form.patchValue({seats: seatNumber});
  }

  public toggleMenu(event: Event, menuPanel: OverlayPanel): void {
    menuPanel.toggle(event);
  }

  public formatResponse = (response: string): string => {
    const items = response.split('\n');
    return `
        <div class="p-4">
           <h2 class="text-7xl font-bold text-gray-800 flex">
            <span id="typing-title" class="whitespace-pre text-7xl"></span>
            <span class="border-r-2 border-gray-800 animate-blink"></span>
        </h2>


        <div class="text-gray-800 text-3xl mt-4">
            <span id="typing-text" class="whitespace-pre"></span>
            <span class="border-r-2 border-gray-800 animate-blink"></span>
        </div>

        <p class="text-gray-600 text-lg font-semibold mt-4">Recommended Places:</p>
    </div>

    <ul class="list-disc list-inside text-left space-y-2">
      ${items
      .filter(item => item.trim())
      .map(item => `<li>${item.trim()}</li>`)
      .join('')}
    </ul>
  `;
  };

  public removeAsteriks = (text: string): string => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
  }


  public selectOption(option: any): void {
    console.log(option)
    if (option.id === 1) {
      this.isCreatingNewUser = true;
      this.selectedOption = 1;
    } else {
      this.isCreatingNewUser = false;
      this.selectedOption = 0;
    }
  }


}
