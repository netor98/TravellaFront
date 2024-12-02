import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SeatMapService {
  private seatMapUpdateSource = new BehaviorSubject<string | null>(null);
  public seatMapUpdate$ = this.seatMapUpdateSource.asObservable();

  updateSeatMap(tripId: string): void {
    this.seatMapUpdateSource.next(tripId);
    console.log('Seat map updated:', tripId);
  }


  constructor() { }
}
