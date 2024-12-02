import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BusService} from "../../../../services/bus.service";
import {SeatMapService} from "../../../../services/seat-map.service";

@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrl: './seat-map.component.css'
})
export class SeatMapComponent implements OnInit {
  @Input() tripId!: string;
  @Input() isReturnTrip: boolean = false; // Indica si es viaje de regreso
  @Output() seatSelected: EventEmitter<number> = new EventEmitter<number>();


  seats: any[] = [];
  selectedSeat: any = null;
  returnSeats: any[] = [];
  outboundSeats: any[] = [];

  constructor(private busService: BusService,
              private seatMapService: SeatMapService) {
  }

  ngOnInit(): void {
    this.loadSeatData(this.tripId);
    this.seatMapService.seatMapUpdate$.subscribe((tripId) => {
      if (tripId) {
        console.log('Seat map updated for trip:', tripId);
        this.tripId = tripId;
        this.loadSeatData(tripId);
      }
    });
  }

  loadSeatData(tripId: string): void {
    this.busService.getAvailableSeats(tripId).subscribe({
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
        if (this.isReturnTrip) {
          this.returnSeats = this.seats;
        } else {
          this.outboundSeats = this.seats;
        }
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

  get currentSeats(): any[] {
    // Devuelve los asientos según el viaje actual
    return this.isReturnTrip ? this.returnSeats : this.outboundSeats;
  }
}
