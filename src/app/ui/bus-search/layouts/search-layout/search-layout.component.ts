import {Component, OnInit} from '@angular/core';
import {BusService} from "../../../../services/bus.service";
import {TripsResponse} from '../../../../domain/models/TripsRespose';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedDataService} from "../../../../services/shared-data.service";
import {CitiesModel} from "../../../../domain/models/cities.model";
import {PageEvent} from "../../../../domain/models/paginator.Interface"
import {PaginatorState} from "primeng/paginator";
import {BookingService} from "../../../../services/booking-service.service";


@Component({
  selector: 'app-search-layout',
  templateUrl: './search-layout.component.html',
  styles: ``
})
export class SearchLayoutComponent implements OnInit {
  trips: TripsResponse[] = [];
  loading: boolean = true;
  error: string | null = null;
  first: number | undefined = 0;
  rows: number | undefined = 4;
  paginatedTrips: any[] = []


  constructor(
    private busService: BusService,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const originCity = params['originCity'];
      const destinationCity = params['destinationCity'];
      const departureTime = params['departureTime'];
      const sortBy = params['sortBy'];
      const isAscending = params['isAscending'] === 'true';
      const pageNumber = +params['pageNumber'] || 1;
      const pageSize = +params['pageSize'] || 10;

      this.searchTrips({
        originCity,
        destinationCity,
        departureTime,
        sortBy,
        isAscending,
        pageNumber,
        pageSize,
      });
    });
  }

  searchTrips(params: any): void {
    const origin: CitiesModel | undefined = params.originCity ? {
      id: '',
      code: '',
      country: '',
      state: '',
      name: params.originCity,
      cityImageUrl: null
    } : undefined;

    const destination: CitiesModel | undefined = params.destinationCity ? {
      id: '',
      code: '',
      country: '',
      state: '',
      name: params.destinationCity,
      cityImageUrl: null
    } : undefined;


    this.loading = true;
    setTimeout(() => {

      this.busService
        .getFilteredTrips(
          origin,
          destination,
          params.departureTime,
          params.sortBy,
          params.isAscending,
          params.pageNumber,
          params.pageSize
        )
        .subscribe({
          next: (data) => {
            this.trips = data;
            console.log(this.trips)
            this.updatePaginatedTrips();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load trips.';
            console.log(err);
            this.loading = false;
          },
        });
    }, 2000);
  }


  // pagination functionalities

  updatePaginatedTrips(): void {
    const start = this.first;
    const end = this.first! + this.rows!;
    this.paginatedTrips = this.trips.slice(start, end);
  }

  onPageChange(event: PaginatorState) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedTrips();
  }

  public handleBooking(trip: any) {
    this.bookingService.setTrip(trip);
    this.router.navigate(['/booking']);
  }
}
