import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TopRoutesDto} from "../domain/models/TopRoutesDto";
import {CitiesModel} from "../domain/models/cities.model";

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private readonly baseUrl: string = environment.BASE_URL;

  constructor(
    private http: HttpClient
  ) {
  }

  getCities(): Observable<CitiesModel[]> {
    return this.http.get<CitiesModel[]>(`${this.baseUrl}/Cities`);
  }
  addCity(city: CitiesModel): Observable<CitiesModel> {
    return this.http.post<CitiesModel>(`${this.baseUrl}/Cities`, city);
  }

  updateCity(id: string, city: CitiesModel): Observable<CitiesModel> {
    return this.http.put<CitiesModel>(`${this.baseUrl}/Cities/${id}`, city);
  }

  deleteCity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Cities/${id}`);
  }
}
