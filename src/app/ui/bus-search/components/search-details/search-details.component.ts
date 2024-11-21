import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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


  public items: any[] = [
    {label: 'Origin City', value: this.originCity},
  ]


  ngOnInit() {
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
}
