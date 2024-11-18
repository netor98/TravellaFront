import {Component, OnInit} from '@angular/core';
import {BusService} from "../../../../services/bus.service";

@Component({
  selector: 'app-search-layout',
  templateUrl: './search-layout.component.html',
  styles: ``
})
export class SearchLayoutComponent implements OnInit {

  cities: any = [];

  constructor(
    private busService: BusService,
  ) {
  }

  ngOnInit(): void {
    this.busService.getCitiesList().subscribe((data: any) => {
      this.cities = data;
      console.log(this.cities)
    });
  }

  travelType: string = 'round-trip';
  fromLocation: any;
  toLocation: any;
  departureDate: Date = new Date();
  returnDate: Date = new Date();
  passengers: number = 1;

  locations = [
    {label: 'Jakarta', value: 'Jakarta'},
    {label: 'Singapore', value: 'Singapore'},
  ];

  passengerOptions = Array.from({length: 5}, (_, i) => ({
    label: `${i + 1} Passenger(s)`,
    value: i + 1
  }));

  searchResults = [
    {
      companyName: 'Garuda Indonesia',
      departureTime: '08:35',
      arrivalTime: '11:20',
      duration: '2h 45m',
      price: 567.00
    },
    {
      companyName: 'Singapore Airlines',
      departureTime: '05:25',
      arrivalTime: '08:10',
      duration: '2h 45m',
      price: 530.00
    },
    {
      companyName: 'Lion Air',
      departureTime: '12:10',
      arrivalTime: '14:55',
      duration: '2h 45m',
      price: 418.00
    },
    // Add more sample data
  ];

  setTravelType(type: string) {
    this.travelType = type;
  }

  searchTravels() {
    // Here you could perform an API call to fetch the filtered search results
    console.log('Searching for travels:', this.fromLocation, this.toLocation, this.departureDate, this.returnDate, this.passengers);
  }

  viewDetails(travel: any) {
    console.log('Viewing details for:', travel);
  }

  reschedule(travel: any) {
    console.log('Rescheduling travel:', travel);
  }

  selectTravel(travel: any) {
    console.log('Selected travel:', travel);
  }
}
