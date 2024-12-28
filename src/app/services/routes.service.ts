import {Injectable} from '@angular/core';
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
  ) {
  }

  getTopRoutes(): Observable<TopRoutesDto[]> {
    return this.http.get<TopRoutesDto[]>(`${this.baseUrl}/Routes/10`);
  }

  getAllRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Routes`);
  }

  getRouteById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Routes/${id}`);
  }

  addRoute(route: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Routes`, route);
  }

  updateRoute(id: string, route: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Routes/${id}`, route);
  }

  deleteRoute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Routes/${id}`);
  }
}
