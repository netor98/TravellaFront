import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrl: './search-details.component.css'
})
export class SearchDetailsComponent {
  @Input() originCity: string = '';
  @Input() destinationCity: string = '';
  @Input() departureTime: string = '';
  @Input() arrivalTime: string = '';
  @Input() duration: string = '';
  @Input() price: string = '';
  @Input() tripType: string = '';
}
