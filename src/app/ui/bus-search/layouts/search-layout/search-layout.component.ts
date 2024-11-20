import {Component, OnInit} from '@angular/core';
import {BusService} from "../../../../services/bus.service";
import { TripsResponse } from '../../../../domain/models/TripsRespose';
import {ActivatedRoute} from "@angular/router";
import {SharedDataService} from "../../../../services/shared-data.service";
import {CitiesModel} from "../../../../domain/models/cities.model";


@Component({
  selector: 'app-search-layout',
  templateUrl: './search-layout.component.html',
  styles: ``
})
export class SearchLayoutComponent implements OnInit {
  trips: TripsResponse[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private busService: BusService,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const originCity = params['originCity'];
      const destinationCity = params['destinationCity'];
      const departureTime = params['departureTime'];
      const sortBy = params['sortBy'];
      const isAscending = params['isAscending'] === 'true';
      const pageNumber = +params['pageNumber'] || 1;
      const pageSize = +params['pageSize'] || 10;

      console.log(params);
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
          console.log(data);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load trips.';
          console.log(err);
          this.loading = false;
        },
      });
  }

}
