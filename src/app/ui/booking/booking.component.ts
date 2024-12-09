import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {BookingService} from "../../services/booking-service.service";
import {AuthService} from "../../services/auth.service";
import {OverlayPanel} from "primeng/overlaypanel";
import {FormBuilder, Validators} from "@angular/forms";
import {v4 as uuidv4} from 'uuid';

import Swal from "sweetalert2";
import {OrderDto} from "../../domain/models/OrderDto";
import {SeatMapService} from "../../services/seat-map.service";
import {Router} from "@angular/router";
import {PaymentService} from "../../services/payment.service";


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  tripDetails: any; // The trip to be booked
  currentTrip: any; // The current trip being booked
  completedOutbound: boolean = false;
  email: string = '';
  selectedUser: any = null;
  selectedOption: number = 0;
  isCreatingNewUser: boolean = false;
  departureDate: string | undefined;
  returnDate: string | null = null;
  isLoading: boolean = false;
  isRoundTrip: boolean = false;
  returnTripDetails: any;
  statusPending: string = '0fbba383-fa1b-4646-a22e-91cd9673ffc8';
  statusActive: string = 'abcd223d-0bb6-4867-9185-07bb4b661048'
  passengerCount: number = 1;
  currentPassengerIndex = 0;
  passengers: any[] = [];
  options: any[] = [
    {
      id: 0,
      name: 'Select passenger'
    },
  ]
  public reservedSeats: number[] = [];
  @Output() seatReserved: EventEmitter<number | null> = new EventEmitter<number | null>();

  public form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required, Validators.minLength(6)]],
    seats: [0, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private seatMapService: SeatMapService,
    private paymentService: PaymentService,
  ) {
  }


  ngOnInit(): void {
    this.isLoading = true;
    this.selectedUser = this.authService.currentUser()();

    const bookingDetails = this.bookingService.getBookingDetails();
    if (bookingDetails) {
      this.passengerCount = bookingDetails.passengersCount;
      this.tripDetails = bookingDetails.outboundTrip;
      this.returnTripDetails = bookingDetails.returnTrip;
      this.isRoundTrip = !!this.returnTripDetails;
      this.departureDate = new Date(this.tripDetails.departureTime).toLocaleString();
      this.returnDate = this.returnTripDetails
        ? new Date(this.returnTripDetails.departureTime).toLocaleString()
        : null;

      this.currentTrip = bookingDetails.returnTrip && !this.completedOutbound
        ? bookingDetails.returnTrip
        : bookingDetails.outboundTrip;
    } else {
      this.router.navigate(['/search']);
    }

    if (!this.tripDetails) {
      this.router.navigate(['/search']);
    } else {
      this.departureDate = new Date(this.tripDetails.departureTime).toLocaleString();
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
          name: 'Guest'
        }
      ]
    }

    setTimeout(() => {

      this.isLoading = false;
    }, 1500)
  }

  public async submitBooking() {
    const bookingDetails = this.bookingService.getBookingDetails();
    const userId = this.selectedUser?.id || 'guest';

    // Get current passenger details from the form
    const passengerDetails = {
      name: this.form.value.fullName, // Assuming you have fields like 'name'
      seatNumber: this.form.value.seats,
      email: this.form.value.email,
    };

    if (passengerDetails.seatNumber) {
      this.reservedSeats = [...this.reservedSeats, passengerDetails.seatNumber];
    }
    this.seatReserved.emit(passengerDetails.seatNumber);


    // Determine the trip being booked
    const tripDetails = this.completedOutbound
      ? bookingDetails.returnTrip // Return trip details
      : bookingDetails.outboundTrip; // Outbound trip details


    // Create ticket for the current phase (outbound or return)
    const currentTicket = {
      tripId: tripDetails.id,
      seatNumber: passengerDetails.seatNumber,
      statusId: this.statusActive,
      userId,
      orderId: bookingDetails.orderId || uuidv4(),
      feeCategoryId: 2,
      contactInfo: passengerDetails.email,
    };


    // Save the ticket under the passenger's data
    if (!this.passengers[this.currentPassengerIndex]) {
      this.passengers[this.currentPassengerIndex] = {
        ...passengerDetails,
        outboundTicket: null,
        returnTicket: null,
      };
    }

    if (this.completedOutbound) {
      this.passengers[this.currentPassengerIndex].returnTicket = currentTicket;
    } else {
      this.passengers[this.currentPassengerIndex].outboundTicket = currentTicket;
    }

    // Check if all passengers are processed for the current phase
    if (this.currentPassengerIndex + 1 < this.passengerCount) {
      // Move to the next passenger
      this.currentPassengerIndex++;
      this.form.reset(); // Reset the form for the next passenger
      this.form.patchValue({email: passengerDetails.email}); // Keep email consistent

      this.showAlert('Passenger Added', `Passenger ${this.currentPassengerIndex + 1} of ${this.passengerCount} added.`, 'success');


    } else if (!this.completedOutbound && this.isRoundTrip) {
      // Switch to return trip booking
      this.completedOutbound = true;
      this.currentPassengerIndex = 0; // Reset to the first passenger

      this.tripDetails = this.returnTripDetails

      this.showAlert('Outbound Trip Booked', 'Proceed to book your return trip.', 'success');

      this.reservedSeats = [];
      this.form.reset(); // Reset the form for the return trip
      this.updateSeatMap(); // Update seat map if applicable
    } else {
      // All passengers and both phases (if round trip) are complete
      const order = {
        id: currentTicket.orderId,
        userId,
        contactInfo: passengerDetails.email,
        statusId: this.statusPending,
        purchaseTime: new Date().toISOString(),
        feeCategoryId: 2,
        tickets: this.passengers.flatMap((p) => {
          const tickets = [];
          if (p.outboundTicket) tickets.push(p.outboundTicket);
          if (p.returnTicket) tickets.push(p.returnTicket);
          return tickets;
        }),
      };

      this.createOrder(order);
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

  public createOrder(orderDto: OrderDto): void {
  console.log(orderDto)
    this.paymentService.createPaymentIntent(orderDto).subscribe(
      (response) => {
        window.location.href = response.sessionUrl;
      },
      (error) => {
        this.showAlert('Booking Failed', `${error}. Please try again.`, 'error');
      }
    );

/*
    this.bookingService.createOrder(orderDto).subscribe(
      (response) => {
        this.showAlert('Booking Complete', 'Your trip has been booked successfully!', 'success');
        this.router.navigate(['/confirmation'], {state: {order: response}});
      },
      (error) => {
        this.showAlert('Booking Failed', `${error}. Please try again.`, 'error');
      }
    );
*/
  }

  /*
         }
       }
     }*/


  public onSeatSelection(seatNumber: number): void {
    this.form.patchValue({seats: seatNumber});
    console.log('Selected seat:', seatNumber);
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

  public updateSeatMap(): void {
    if (this.tripDetails?.id) {
      this.seatMapService.updateSeatMap(this.tripDetails.id);
    } else {
      console.warn('No trip ID available for seat map update.');
    }

  }
}
