import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";
import {TripsResponse} from "../domain/models/TripsRespose";
import {CitiesResponse} from "../domain/models/cities-response.interface";
import {CitiesModel} from "../domain/models/cities.model";

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private readonly baseUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) {
  }

  getCitiesList(): Observable<CitiesResponse[]> {
    return this.http.get<CitiesResponse[]>(`${this.baseUrl}/Cities`);
  }

  getFilteredTrips(
    origin?: CitiesModel,
    destination?: CitiesModel,
    departureDate?: string, // Expecting a string, but can be Date depending on format
    sortBy?: string,
    isAscending: boolean = true,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<TripsResponse[]> {

    // Start with the base URL for trips
    let params = new HttpParams();

    // Add filters to the params if they are provided
    if (origin) {
      params = params.set('originCity', origin.name!);
      console.log(origin.name)
    }
    if (destination) {
      params = params.set('destinationCity', destination.name!);
    }
    if (departureDate) {
      params = params.set('departureTime', departureDate);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    params = params.set('isAscending', isAscending.toString());
    params = params.set('pageNumber', pageNumber.toString());
    params = params.set('pageSize', pageSize.toString());

    console.log(params)
    console.log('Final URL:', `${this.baseUrl}/Trips?${params.toString()}`);
    // Perform the HTTP GET request with query parameters
    return this.http.get<TripsResponse[]>(`${this.baseUrl}/Trips`, {params});
  }
}
