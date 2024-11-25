import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {BusService} from "../../../../services/bus.service";
import {CitiesModel} from "../../../../domain/models/cities.model";
import {CitySearchService} from "../../../../services/city-search.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import Swal from "sweetalert2";
import {
  CitiesResponse
} from "../../../../domain/models/cities-response.interface";
import {TripsResponse} from "../../../../domain/models/TripsRespose";
import {SharedDataService} from "../../../../services/shared-data.service";
import {Router} from "@angular/router";

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
  @Input() isSearchPage: boolean = false;
  cities: CitiesModel[] = [];
  public animationState: string = 'default';
  public errorMessage: string | null = null;
  public minDate = new Date();
  public checked: boolean = false;
  from: string = '';
  to: string = '';
  trips: TripsResponse[] = [];
  scrolled: boolean = false;

  constructor(
    private citySearchService: CitySearchService,
    private busService: BusService,
    private sharedDataService: SharedDataService,
    private router: Router
  ) {
  }

  ngOnInit() {

    const savedState = localStorage.getItem('searchTripState');
    console.log(savedState)
    if (savedState) {

      const state = JSON.parse(savedState);
      this.selectedFrom = state.selectedFrom || null;
      this.selectedTo = state.selectedTo || null;
      this.departureDate = state.departureDate ? new Date(state.departureDate) : new Date();
      this.selectedPassenger = state.selectedPassenger || 1;
    }
    this.fetchCities();
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.scrolled = scrollY > 50;
  }

  fetchCities() {
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


  selectedFrom: CitiesModel | null = null;
  selectedTo: CitiesModel | null = null;
  departureDate: Date | null = new Date();
  selectedPassenger = 1;


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
      this.errorSameCities();
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


  public searchTrips() {
    const origin: CitiesModel | null = this.selectedFrom;
    const destination: CitiesModel | null = this.selectedTo;
    const departureDate = this.departureDate ? this.departureDate.toISOString().split('T')[0] : null;  // Format date to YYYY-MM-DD
    const sortBy = 'departureTime';
    const isAscending = true;
    const pageNumber = 1;
    const pageSize = 500;


    if ((origin && destination) && origin?.name === destination?.name) {
      this.errorSameCities();
      return;
    }


    const searchParams = {
      originCity: origin?.name || null,
      destinationCity: destination?.name || null,
      departureTime: departureDate || null,
      sortBy: 'departureTime',
      isAscending: true,
      pageNumber,
      pageSize
    };
    this.router.navigate(['/search'], {queryParams: searchParams});

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
          this.trips = trips;
          this.sharedDataService.setTrips(trips);
          this.sharedDataService.setSearchParams(searchParams);
          const state = {
            selectedFrom: this.selectedFrom,
            selectedTo: this.selectedTo,
            departureDate: this.departureDate?.toISOString(),
            selectedPassenger: this.selectedPassenger,
          };

          localStorage.setItem('searchTripState', JSON.stringify(state));
        },
        (error) => {
          console.error('Error fetching trips:', error);
        }
      );
  }

  public errorSameCities() {
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
  }

}
