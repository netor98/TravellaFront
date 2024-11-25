import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FiltersTripsService {
  private filtersSource = new BehaviorSubject<any>({
    timeRange: [],
    priceRange: [300, 800],
    discountType: null
  });
  filters$ = this.filtersSource.asObservable();

  updateFilters(newFilters: any): void {
    this.filtersSource.next(newFilters);
    console.log('Filters updated:', newFilters);
  }
}
