import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {OrdersService} from "../../../../services/orders.service";
import {ComplaintsService} from "../../../../services/complaints.service";
import {ComplaintType} from "../../../../domain/models/ComplaintType";
import Swal from "sweetalert2";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory
} from "@google/generative-ai";
import {environment} from "../../../../../environments/environment.development";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css',
})
export class ComplaintComponent implements OnInit {
  orderId: string | null = null;
  order: any;
  complaintForm: FormGroup;
  loading: boolean = true;
  totalAmount: number = 0;
  complaintTypes: ComplaintType[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private complaintsService: ComplaintsService,
    private authService: AuthService
  ) {
    this.complaintForm = this.formBuilder.group({
      description: ['', [Validators.required]],
      complaintType: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    if (!this.orderId) {
      this.router.navigate(['/my-orders']);
    }


    // Fetch order details
    this.ordersService.getOrderById(this.orderId!).subscribe((order) => {
      this.order = order;
      console.log('Order:', this.order);
      this.totalAmount = order.tickets.reduce((acc: number, ticket: any) => acc + ticket.price, 0);
      console.log('Total amount:', this.totalAmount);
      setTimeout(() => {
        this.loading = false;
      }, 1500)
    });

    this.complaintsService.getComplaintsTypes().subscribe((complaintTypes) => {
      this.complaintTypes = complaintTypes;
    });

  }

  async submitComplaint(): Promise<void> {
    this.authService.showLoadingSpinner();
    if (this.complaintForm.valid) {
      const complaint = {
        orderId: this.orderId,
        userId: this.order.userId,
        ...this.complaintForm.value,
        complaintTypeId: this.complaintForm.value.complaintType.id,
      };

      const validComplaint = await this.responseGemini();
      if (!validComplaint) {
        this.showAlert('Invalid complaint', 'Your complaint is not reasonable. Please try again.', 'error');
        return;
      }
      this.complaintsService.submitComplaint(complaint).subscribe({
        next: () => {
          this.showAlert('Complaint submitted', 'Your complaint has been submitted successfully.', 'success');
          this.router.navigate(['/my-bookings']);
        },
        error: () => {
          alert('Failed to submit complaint. Please try again later.');
        },
      });
    }
  }
  public showAlert(title: string, text: string, icon: any): void {

    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Close',
    });
  }



  public async responseGemini(): Promise<boolean> {
    const description = this.complaintForm.get('description')?.value;
    const complaintType = this.complaintForm.get('complaintType')?.value;
    const prompt = `Is this a reasonable complaint?, return true if it is, false otherwise. Type: ${complaintType}, Description: ${description}`;

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
      return response.text() === 'true';
    } catch (error) {
      return false;
    }

  }
}
