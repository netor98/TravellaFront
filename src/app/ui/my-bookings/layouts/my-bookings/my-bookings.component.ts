import {Component, ElementRef, ViewChild} from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {TicketsService} from "../../../../services/tickets.service";
import {Ticket} from "../../../../domain/models/Ticket";
import Swal from "sweetalert2";

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})

export class MyBookingsComponent {
  tickets: Ticket[] = [];
  paginatedTickets: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  first: number = 0;
  rows: number = 5;
  @ViewChild('ticketInfo', {static: false}) ticketInfoRef!: ElementRef;
  items: any[] = []

  constructor(private ticketsService: TicketsService, private authService: AuthService) {
  }

  ngOnInit(): void {
    const userId = this.authService.currentUser()()?.id;
    if (userId) {
      this.fetchTickets(userId);
    } else {
      this.error = 'User not logged in.';
      this.loading = false;
    }
    this.items = [
      {
        label: 'See Details',
        icon: 'pi pi-info-circle',
        command: () => {
          const trip = JSON.parse(this.ticketInfoRef.nativeElement.value);
          Swal.fire({
            title: 'Trip Details',
            html: `
            <div>
                <p><strong>From:</strong> ${trip.route.origin.name}</p>
                <p><strong>To:</strong> ${trip.route.destination.name}</p>
                <p><strong>Departure:</strong> ${new Date(trip.departureTime).toLocaleString()}</p>
                <p><strong>Arrival:</strong> ${new Date(trip.arrivalTime).toLocaleString()}</p>
                <p><strong>Price:</strong> $${trip.price}</p>
            </div>
            `,
            icon: 'info',
            confirmButtonText: 'Close',
          });
        }
      },
      {
        label: 'Make complaint',
        icon: 'pi pi-flag-fill'
      },
      {
        separator: true
      },
    ]
  }

  fetchTickets(userId: string): void {
    this.ticketsService.getTicketsByUser(userId).subscribe({
      next: (data) => {
        this.tickets = data;
        this.updatePaginatedTickets();
        setTimeout(() => {
          this.loading = false;
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load tickets.';
        this.loading = false;
      }
    });
  }

  updatePaginatedTickets(): void {
    const start = this.first;
    const end = this.first + this.rows;
    this.paginatedTickets = this.tickets.slice(start, end);
  }

  onPageChange(event: any): void {
    window.scrollTo({top: 0, behavior: 'smooth'});
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedTickets();
  }
}
