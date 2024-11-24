import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BusService} from "../../../../services/bus.service";

@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrl: './seat-map.component.css'
})
export class SeatMapComponent {
  @Input() tripId!: string;
  @Output() seatSelected: EventEmitter<number> = new EventEmitter<number>();


  seats: any[] = [];
  selectedSeat: any = null;

  constructor(private busService: BusService) {
  }

  ngOnInit(): void {
    this.loadSeatData();
  }

  loadSeatData(): void {
    this.busService.getAvailableSeats(this.tripId).subscribe({
      next: (data) => {
        const totalCapacity = data.totalCapacity;
        console.log(data)
        const availableSeats = new Set(data.availableSeats);

        this.seats = Array.from({length: totalCapacity}, (_, i) => {
          const seatNumber = i + 1;
          return {
            number: seatNumber,
            status: availableSeats.has(seatNumber) ? 'available' : 'reserved',
          };
        });
        console.log('Seats loaded:', this.seats);
      },
      error: (err) => {
        console.error('Error loading seat data:', err);
      },
    });
  }

  selectSeat(seat: any): void {
    if (seat.status !== 'available') {
      return;
    }

    // Mark previously selected seat as available
    if (this.selectedSeat) {
      this.selectedSeat.status = 'available';
    }

    // Mark new seat as selected
    seat.status = 'selected';
    this.selectedSeat = seat;
    this.seatSelected.emit(seat.number);
  }

  confirmSeat(): void {
    alert(`You have selected seat number ${this.selectedSeat.number}`);
    // Send the selected seat back to the parent or book it directly
  }
}
