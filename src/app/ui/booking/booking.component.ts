import {Component, OnInit} from '@angular/core';
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

  }

  public async submitBooking() {
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
      maxOutputTokens: 100, // limit output
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-pro', // or 'gemini-pro-vision'
      ...generationConfig,
    });

    const prompt = `I'll visit ${this.tripDetails.route.destination.name} in the next days, can you tell me places to visit?`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text());

    const {email, fullName, seats} = this.form.value;
    alert(`Booking submitted for ${fullName} with email ${email} for ${seats} seats`);

  }

  public onSeatSelection(seatNumber: number): void {
    this.form.patchValue({seats: seatNumber});
  }

  public toggleMenu(event: Event, menuPanel: OverlayPanel): void {
    menuPanel.toggle(event);
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
