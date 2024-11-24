import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BusService} from "../../../../services/bus.service";

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrl: './search-details.component.css'
})
export class SearchDetailsComponent implements OnInit {
  @Input() originCity: string = '';
  @Input() codeOrigin: string = '';
  @Input() stateOrigin: string = '';
  @Input() stateDestination: string = '';
  @Input() destinationCity: string = '';
  @Input() codeDestination: string = '';
  @Input() departureTime: string = '';
  @Input() arrivalTime: string = '';
  @Input() duration: string = '';
  @Input() price: string = '';
  @Input() tripType: string = '';
  @Input() trip: any;
  @Output() book = new EventEmitter<any>();
  @Input() tripId!: string;
  availableSeats: number[] = [];
  totalSeats: number = 0;
  reservedSeats: number = 0;
  public items: any[] = []


  constructor(private busService: BusService) {
  }

  ngOnInit() {

    this.fetchAvailableSeats();
    this.items = [
      {
        label: 'Save',
        icon: 'pi pi-save',
      },
      {
        label: 'See Details',
        icon: 'pi pi-info-circle',
      },
      {
        label: 'Search',
        icon: 'pi pi-search'
      },
      {
        separator: true
      },
    ]
  }

  bookTrip(trip: any) {
    this.book.emit(trip);
  }

  fetchAvailableSeats(): void {
    this.busService.getAvailableSeats(this.tripId).subscribe({
      next: (data) => {
        this.availableSeats = data.availableSeats;
        this.totalSeats = data.totalCapacity;
        this.reservedSeats = data.reservedCount;
      },
      error: (err) => {
        console.error('Error fetching available seats:', err);
      },
    });
  }
}
