import {Component, OnInit} from '@angular/core';
import {filter} from "rxjs";
import {BusService} from "../../../../services/bus.service";
import {CitiesModel} from "../../../../domain/models/cities.model";
import {CitySearchService} from "../../../../services/city-search.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import Swal from "sweetalert2";
import {
  CitiesResponse
} from "../../../../domain/models/cities-response.interface";
import {TripsResponse} from "../../../../domain/models/TripsRespose";

@Component({
  selector: 'search-trip',
  templateUrl: './search-trip.component.html',
  styleUrl: './search-trip.component.css',
  animations: [
    trigger('cityChangeAnimation', [
      state('default', style({transform: 'rotateY(0)'})),
      state('changed', style({transform: 'rotateY(180deg)'})),
      transition('default <=> changed', [
        animate('0.5s ease-in-out')
      ]),
    ])
  ]
})
export class SearchTripComponent implements OnInit {

  cities: CitiesModel[] = [];
  public animationState: string = 'default';
  public errorMessage: string | null = null;
  public minDate = new Date();

  trips: TripsResponse[] = [];

  constructor(
    private citySearchService: CitySearchService,
    private busService: BusService
  ) {
  }

  ngOnInit() {
    this.busService.getCitiesList().subscribe((cities: CitiesResponse[]) => {
      this.cities = cities.map((city: CitiesResponse) => ({
        name: city.name,
        country: city.country,
        state: city.state,
        value: city.code,
        cityImageUrl: city.cityImageUrl,
        id: city.id,
        code: city.code
      }));
      this.citySearchService.setCities(cities);
    });
  }

  passengerOptions = [
    {label: '1 adult', value: 1},
    {label: '2 adults', value: 2},
    {label: '3 adults', value: 3},
    // Add more options if needed
  ];

  filters = [
    {name: 'Economy Bus'},
    {name: 'Executive Bus'},
    {name: 'Luxury Bus'},
  ];

  selectedFrom: CitiesModel | null = null;
  selectedTo: CitiesModel | null = null;
  departureDate: Date | null = new Date();
  selectedPassenger = 1;
  selectedFilter: string | null = null;


  public changeCities(): void {
    if (this.selectedFrom === null || this.selectedTo === null) {
      console.log('Please select both cities');
      this.errorMessage = 'Please select both cities';

      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-start",
        customClass: {
          popup: "colored-toast"
        },
        iconColor: "#fff",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: this.errorMessage,
      });
      return;
    }

    if (this.selectedFrom === this.selectedTo) {
      this.errorMessage = 'Please select different cities';

      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-start",
        customClass: {
          popup: "colored-toast"
        },
        iconColor: "#fff",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "warning",
        title: this.errorMessage,
      });
      return;
    }


    this.errorMessage = null;
    this.animationState = this.animationState === 'default' ? 'changed' : 'default';
    setTimeout(() => {
      const temp = this.selectedFrom;
      this.selectedFrom = this.selectedTo;
      this.selectedTo = temp;
    }, 500);
  }


  public searchTrips(): void {
    const origin: CitiesModel | null = this.selectedFrom;
    const destination: CitiesModel | null = this.selectedTo;
    const departureDate = this.departureDate ? this.departureDate.toISOString().split('T')[0] : null;  // Format date to YYYY-MM-DD
    const sortBy = 'departureTime'; // Puede ser dinámico dependiendo de los requisitos
    const isAscending = true; // Puede ser dinámico dependiendo de los requisitos
    const pageNumber = 1; // Número de página que estás buscando
    const pageSize = 10;

    console.log('Parametros de búsqueda:', {
      origin,
      destination,
      departureDate,
      sortBy,
      isAscending,
      pageNumber,
      pageSize
    });
    this.busService
      .getFilteredTrips(
        origin!,
        destination!,
        departureDate!,
        sortBy,
        isAscending,
        pageNumber,
        pageSize)
      .subscribe(
        (trips) => {
          this.trips = trips; // Store the trips in the component
          console.log('Filtered trips:', this.trips); // For debugging
        },
        (error) => {
          console.error('Error fetching trips:', error);
        }
      );
  }
}
