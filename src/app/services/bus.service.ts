import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {catchError, Observable, retry, throwError} from "rxjs";
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
    return this.http.get<CitiesResponse[]>(`${this.baseUrl}/Cities`).pipe(
      retry({
        count: 6,
        delay: 3000,
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    )
  }

  getFilteredTrips(
    origin?: CitiesModel,
    destination?: CitiesModel,
    departureDate?: string,
    sortBy?: string,
    isAscending: boolean = true,
    pageNumber: number = 1,
    pageSize: number = 100
  ): Observable<TripsResponse[]> {

    let params = new HttpParams();

    if (origin) {
      params = params.set('originCity', origin.name!);
    }
    if (destination) {
      params = params.set('destinationCity', destination.name!);
    }
    if (departureDate) {
      const utcDate = new Date(departureDate).toISOString();
      params = params.set('departureTime', utcDate);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    params = params.set('isAscending', isAscending.toString());
    params = params.set('pageNumber', pageNumber.toString());
    params = params.set('pageSize', pageSize.toString());
    return this.http.get<TripsResponse[]>(`${this.baseUrl}/Trips`, {params});
  }

  public getAvailableSeats(tripId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/trips/${tripId}/available-seats`);
  }
}
