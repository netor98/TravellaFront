import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "../../services/booking-service.service";
import {AuthService} from "../../services/auth.service";
import {OverlayPanel} from "primeng/overlaypanel";
import {FormBuilder, Validators} from "@angular/forms";
import { v4 as uuidv4 } from 'uuid';

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory
} from "@google/generative-ai";
import {environment} from "../../../environments/environment.development";
import Swal from "sweetalert2";
import {Order} from "../../domain/models/Order";
import {OrderDto} from "../../domain/models/OrderDto";


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
    this.selectedUser = this.authService.currentUser()();

    const bookingDetails = this.bookingService.getBookingDetails();
    if (bookingDetails) {
      console.log('Booking details found', bookingDetails);
      this.tripDetails = bookingDetails.outboundTrip;
      this.returnTripDetails = bookingDetails.returnTrip;
      this.isRoundTrip = !!this.returnTripDetails;
      this.departureDate = new Date(this.tripDetails.departureTime).toLocaleString();
      this.returnDate = this.returnTripDetails
        ? new Date(this.returnTripDetails.departureTime).toLocaleString()
        : null;

      this.tripDetails = bookingDetails.outboundTrip; // Default to outbound trip
      this.isRoundTrip = !!bookingDetails.returnTrip; // Check if round-trip
      this.returnTripDetails = bookingDetails.returnTrip;

      this.currentTrip = bookingDetails.returnTrip && !this.completedOutbound
        ? bookingDetails.returnTrip
        : bookingDetails.outboundTrip;
    } else {
      console.error('No trip details found. Redirecting...');
      this.router.navigate(['/search']);
    }
    /*
        this.tripDetails = this.bookingService.getTrip();
    */


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
    const orderId = uuidv4();
    this.authService.showLoadingSpinner('Booking your trip...');

    const bookingDetails = this.bookingService.getBookingDetails();
    const userId = this.selectedUser?.id || 'guest';

    console.log(userId);
    // Crear el ticket actual (ida o vuelta según el contexto)
    const currentTicket = {
      tripId: this.tripDetails.id,
      seatNumber: this.form.value.seats,
      statusId: this.statusActive,
      userId,
      orderId,
    };

    if (this.completedOutbound && this.isRoundTrip) {
      // Flujo para completar el viaje de vuelta
      const returnTicket = {
        tripId: this.returnTripDetails.id,
        seatNumber: this.form.value.seats,
        statusId: this.statusActive,
        userId,
        orderId,
      };

      const order = {
        id: orderId,
        userId,
        contactInfo: this.form.value.email,
        statusId: this.statusPending,
        purchaseTime: new Date().toISOString(),
        tickets: [bookingDetails.tickets[0], returnTicket], // Añadir ambos tickets
      };

      this.bookingService.createOrder(order).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Booking Complete',
            text: 'Your round trip has been booked successfully!',
          });
          this.router.navigate(['/confirmation'], { state: { order: response } });
        },
        (error) => {
          console.error('Order creation failed:', error);
          Swal.fire({
            icon: 'error',
            title: 'Booking Failed',
            text: 'An error occurred while booking your trip. Please try again.',
          });
        }
      );
    } else {
      // Flujo para el viaje de ida
      bookingDetails.tickets = [currentTicket]; // Guardar solo el ticket de ida
      this.bookingService.saveBookingDetails(bookingDetails);

      if (this.isRoundTrip) {
        this.completedOutbound = true;

        // Cambiar a los detalles del viaje de vuelta
        this.returnTripDetails = this.bookingService.getReturnTripDetails(); // Asegúrate de que este método funcione correctamente
        this.tripDetails = this.returnTripDetails;

        this.form.reset();
        this.form.patchValue({ email: this.form.value.email }); // Mantener el email

        Swal.fire({
          icon: 'success',
          title: 'Outbound Trip Booked',
          text: 'Proceed to book your return trip.',
        });
      } else {
        // Crear orden para viaje sencillo
        const order = {
          id: orderId,
          userId,
          contactInfo: this.form.value.email,
          statusId: this.statusPending,
          purchaseTime: new Date().toISOString(),
          tickets: [currentTicket],
        };

        this.bookingService.createOrder(order).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Booking Complete',
              text: 'Your trip has been booked successfully!',
            });
            this.router.navigate(['/confirmation'], { state: { order: response } });
          },
          (error) => {
            console.error('Order creation failed:', error);
            Swal.fire({
              icon: 'error',
              title: 'Booking Failed',
              text: 'An error occurred while booking your trip. Please try again.',
            });
          }
        );
      }
    }
  }















/*  public async submitBooking() {
    const orderId = uuidv4();
    this.authService.showLoadingSpinner('Booking your trip...');

    const bookingDetails = this.bookingService.getBookingDetails();
    const userId = this.selectedUser?.id || 'guest';

    // Crear el ticket para el viaje actual (ida o vuelta)
    const currentTicket = {
      tripId: this.tripDetails.id,
      seatNumber: this.form.value.seats,
      statusId: this.statusActive,
      userId,
      orderId, // Relacionar con la orden
    };

    if (this.completedOutbound && this.isRoundTrip) {
      // Flujo para el viaje de vuelta
      const returnTicket = {
        tripId: this.returnTripDetails.id,
        seatNumber: this.form.value.seats,
        statusId: this.statusActive,
        userId,
        orderId, // Relacionar con la orden
      };

      const order = {
        id: orderId,
        userId,
        contactInfo: this.form.value.email,
        statusId: this.statusPending,
        purchaseTime: new Date().toISOString(),
        tickets: [currentTicket, returnTicket], // Añadir ambos tickets
      };
      console.log(order);

      // Crear la orden con ambos tickets
      this.bookingService.createOrder(order).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Booking Complete',
            text: 'Your round trip has been booked successfully!',
          });
          this.router.navigate(['/confirmation'], {state: {order: response}});
        },
        (error) => {
          console.error('Order creation failed:', error);
          Swal.fire({
            icon: 'error',
            title: 'Booking Failed',
            text: 'An error occurred while booking your trip. Please try again.',
          });
        }
      );
    } else {
      // Flujo para el viaje de ida
      bookingDetails.tickets = [currentTicket]; // Guardar solo el ticket de ida
      this.bookingService.saveBookingDetails(bookingDetails);

      if (this.isRoundTrip) {
        this.completedOutbound = true;
        this.bookingService.saveBookingDetails({
          ...this.bookingService.getBookingDetails(),
          tickets: [currentTicket],
        });
        this.tripDetails = this.returnTripDetails;

        // Cambiar a los detalles del viaje de vuelta
        this.form.reset();
        this.form.patchValue({email: this.form.value.email}); // Mantener el email
        Swal.fire({
          icon: 'success',
          title: 'Outbound Trip Booked',
          text: 'Proceed to book your return trip.',
        });
      } else {
        // Crear orden para viaje sencillo
        const order = {
          id: orderId,
          userId,
          contactInfo: this.form.value.email,
          statusId: this.statusPending,
          purchaseTime: new Date().toISOString(),
          tickets: [currentTicket],
        };

        this.bookingService.createOrder(order).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Booking Complete',
              text: 'Your trip has been booked successfully!',
            });
            this.router.navigate(['/confirmation'], {state: {order: response}});
          },
          (error) => {
            console.error('Order creation failed:', error);
            Swal.fire({
              icon: 'error',
              title: 'Booking Failed',
              text: 'An error occurred while booking your trip. Please try again.',
            });
          }
        );
      }
    }
  }*/







/*  public async submitBooking() {
    const orderId = uuidv4();
    this.authService.showLoadingSpinner('Booking your trip...');

    const bookingDetails = this.bookingService.getBookingDetails();
    const userId = this.selectedUser?.id || 'guest';

    const currentTicket = {
      tripId: this.tripDetails.id,
      seatNumber: this.form.value.seats,
      statusId: this.statusActive,
      userId,
      orderId, // Relacionar con la orden
    };


    if (this.completedOutbound && this.isRoundTrip) {
      // Añadir ticket para el viaje de vuelta
      const returnTicket = {
        tripId: this.returnTripDetails.id,
        seatNumber: this.form.value.seats,
        statusId: this.statusActive,
        userId,
        orderId, // Relacionar con la orden
      };


      const order = {
        id: orderId, // Asignar el ID al pedido
        userId: this.selectedUser?.id || 'guest',
        contactInfo: this.form.value.email,
        statusId: this.statusPending, // Reemplaza con el ID de estado válido
        purchaseTime: new Date().toISOString(),
        tickets: [currentTicket, returnTicket],
      };


      this.bookingService.createOrder(order).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Booking Complete',
            text: 'Your trip has been booked successfully!',
          });
          this.router.navigate(['/confirmation'], {state: {order: response}});
        },
        (error) => {
          console.error('Order creation failed:', error);
          Swal.fire({
            icon: 'error',
            title: 'Booking Failed',
            text: 'An error occurred while booking your trip. Please try again.',
          });
        }
      );

    } else {
      // Añadir ticket para el viaje de ida
      bookingDetails.tickets = [currentTicket];
      this.bookingService.saveBookingDetails(bookingDetails);

      if (this.isRoundTrip) {
        this.completedOutbound = true;

        // Cambiar a los detalles del viaje de vuelta
        this.tripDetails = bookingDetails.returnTrip;
        this.form.reset();
        this.form.patchValue({email: this.form.value.email}); // Mantener el email
        Swal.fire({
          icon: 'success',
          title: 'Outbound Trip Booked',
          text: 'Proceed to book your return trip.',
        });
      } else {

        const order = {
          userId,
          contactInfo: this.form.value.email,
          statusId: this.statusPending,
          purchaseTime: new Date().toISOString(),
          tickets: [currentTicket]
        };


        // Crear orden para viaje sencillo
        /!*
                const order: OrderDto = {
                  userId: this.selectedUser?.id || 'guest',
                  contactInfo: this.form.value.email,
                  statusId: this.statusPending,
                  purchaseTime: new Date().toISOString(),
                  tickets: bookingDetails.tickets,
                };
        *!/

        this.bookingService.createOrder(order).subscribe(
          (response) => {
            console.log(response);
            Swal.fire({
              icon: 'success',
              title: 'Booking Complete',
              text: 'Your trip has been booked successfully!',
            });
            this.router.navigate(['/'], {state: {order: response}});
          },
          (error) => {
            console.error('Order creation failed:', error);
            Swal.fire({
              icon: 'error',
              title: 'Booking Failed',
              text: 'An error occurred while booking your trip. Please try again.',
            });
          }
        );


        /!*
            const bookingData = {
              tripId: this.currentTrip.id,
              fullName: this.form.value.fullName,
              email: this.form.value.email,
              seatNumber: this.form.value.seats,
            };

            this.completedOutbound = true;
            this.tripDetails = this.returnTripDetails;
            this.currentTrip = this.returnTripDetails;
            this.form.reset(); // Reset the form for the return trip
            this.form.patchValue({ email: bookingData.email });
            Swal.fire({
              icon: 'success',
              title: 'Outbound Trip Booked',
              text: 'Proceed to book your return trip.',
            });
        *!/
        /!** *!/

        /!*
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
        *!/
      }
    }
  }*/

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
