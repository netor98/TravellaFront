import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationState} from "../../domain/models/NavigationState";
import {BookingService} from "../../services/booking-service.service";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  tripDetails: any; // The trip to be booked
  passengerName: string = '';
  email: string = '';
  phone: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.tripDetails = this.bookingService.getTrip();
    if (!this.tripDetails) {
      console.error('No trip details found. Redirecting...');
      this.router.navigate(['/search']);
    }

    console.log(this.tripDetails);
  }

  submitBooking() {
    const bookingDetails = {
      trip: this.tripDetails,
      passengerName: this.passengerName,
      email: this.email,
      phone: this.phone,
    };

    // Navigate to the payment page with booking details
    this.router.navigate(['/payment'], { state: { bookingDetails } });
  }
}
