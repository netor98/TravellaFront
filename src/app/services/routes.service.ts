import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TopRoutesDto} from "../domain/models/TopRoutesDto";

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  private readonly baseUrl: string = environment.BASE_URL;

  constructor(
    private http: HttpClient
  ) { }

  getTopRoutes(): Observable<TopRoutesDto[]> {
    return this.http.get<TopRoutesDto[]>(`${this.baseUrl}/Routes/10`);
  }
}
