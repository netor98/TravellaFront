import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {CitiesModel} from "../domain/models/cities.model";

@Injectable({
  providedIn: 'root'
})
export class CitySearchService {
  private citiesSubject = new BehaviorSubject<CitiesModel[]>([]);
  private searchQuerySubject = new BehaviorSubject<string>('');

  setCities(cities: CitiesModel[]) {
    this.citiesSubject.next(cities);
  }

  getCities(): Observable<CitiesModel[]> {
    return this.citiesSubject.asObservable();
  }

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }


  getFilteredCities(query: string): Observable<CitiesModel[]> {
    return this.getCities().pipe(
      map(cities => cities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }
}
