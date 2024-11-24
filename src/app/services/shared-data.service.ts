import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TripsResponse} from "../domain/models/TripsRespose";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {


  private tripsSubject = new BehaviorSubject<TripsResponse[]>([]);
  public trips$ = this.tripsSubject.asObservable();

  private searchParamsSubject = new BehaviorSubject<any>(this.getSavedSearchParams());
  public searchParams$ = this.searchParamsSubject.asObservable();

  setTrips(trips: TripsResponse[]): void {
    this.tripsSubject.next(trips);
  }

  getTrips(): TripsResponse[] {
    return this.tripsSubject.getValue();
  }

  setSearchParams(params: any): void {
    this.searchParamsSubject.next(params);
    localStorage.setItem('searchParams', JSON.stringify(params));
  }

  public getSavedSearchParams(): any {
    const savedParams = localStorage.getItem('searchParams');
    return savedParams ? JSON.parse(savedParams) : null;
  }
}


