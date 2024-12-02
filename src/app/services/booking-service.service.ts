import {Injectable} from '@angular/core';
import {Order} from "../domain/models/Order";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {OrderDto} from "../domain/models/OrderDto";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private tripDetails: any;
  private readonly baseUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) {
  }

  setTrip(trip: any) {
    this.tripDetails = trip;
  }

  getTrip() {
    return this.tripDetails;
  }

  getBookingDetails() {
    const bookingDetails = localStorage.getItem('bookingDetails');
    return bookingDetails ? JSON.parse(bookingDetails) : null;
  }


  createOrder(order: any): Observable<any> {
    console.log(order);
    return this.http.post<any>(`${this.baseUrl}/Orders`, order);
  }


  saveBookingDetails(details: any): void {
    localStorage.setItem('bookingDetails', JSON.stringify(details));
  }

  getReturnTripDetails(): any {
    const bookingDetails = this.getBookingDetails();
    if (!bookingDetails || !bookingDetails.returnTrip) {
      console.error('No return trip details found.');
      return null;
    }
    return bookingDetails.returnTrip;
  }
}
