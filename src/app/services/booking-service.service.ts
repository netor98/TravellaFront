import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private tripDetails: any;

  setTrip(trip: any) {
    this.tripDetails = trip;
  }

  getTrip() {
    return this.tripDetails;
  }

  constructor() {
  }
}
