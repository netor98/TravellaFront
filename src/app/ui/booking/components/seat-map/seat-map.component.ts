import {
  Component,
  EventEmitter,
  Input, numberAttribute,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {BusService} from "../../../../services/bus.service";
import {SeatMapService} from "../../../../services/seat-map.service";

@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrl: './seat-map.component.css'
})
export class SeatMapComponent implements OnInit, OnChanges {
  @Input() tripId!: string | null;
  @Input() isRoundedTrip: boolean = false; // Indica si es un viaje redondo
  @Input() isReturnTrip: boolean = false; // Indica si es viaje de regreso
  @Output() seatSelected: EventEmitter<number> = new EventEmitter<number>();
  @Input() reservedSeats: number[] = [];

  seats: any[] = [];
  selectedSeat: any = null;
  returnSeats: any[] = [];
  outboundSeats: any[] = [];
  newTrip: number = 0;

  constructor(private busService: BusService,
              private seatMapService: SeatMapService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservedSeats']) {
      this.updateReservedSeats();
      this.selectedSeat = null;
    }
  }


  //BUG: AFTER FINISHING THE SEAT SELECTION IN A RETURN TRIP
  // THE SEAT SELECTION CHARGE THE SEAT MAP OF THE PREVIOUS RETURN TRIP
  ngOnInit(): void {
    console.log(this.tripId, this.isRoundedTrip, this.isReturnTrip, this.newTrip);
    this.loadSeatData(this.tripId);

    this.seatMapService.seatMapUpdate$.subscribe((tripId) => {
      if (tripId !== this.tripId && this.isRoundedTrip && this.newTrip === 1) {

        console.log('Seat map updated for trip:', tripId);
        this.tripId = tripId;
        this.loadSeatData(tripId);
      }
    });

    this.newTrip = 1;
  }

  updateReservedSeats(): void {
    if (this.seats) {
      this.seats.forEach((seat) => {
        if (this.reservedSeats.includes(seat.number)) {
          seat.status = 'reserved';
        }
      });
    }
  }

  loadSeatData(tripId: string | null): void {
    this.seats = [];
    this.busService.getAvailableSeats(tripId!).subscribe({
      next: (data) => {
        console.log('Seat data loaded:', data);
        const totalCapacity = data.totalCapacity;
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
      if (this.reservedSeats.includes(this.selectedSeat.number)) {
        this.selectedSeat.status = 'reserved';
      } else this.selectedSeat.status = 'available';
    }


    // Mark new seat as selected
    seat.status = 'selected';
    this.selectedSeat = seat;
    this.seatSelected.emit(seat.number);
  }

  get currentSeats(): any[] {
    // Devuelve los asientos según el viaje actual
    return this.isReturnTrip ? this.returnSeats : this.outboundSeats;
  }

}
