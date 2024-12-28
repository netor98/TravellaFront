import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private readonly baseUrl = 'http://localhost:5289/api/Maintenance';

  constructor(private http: HttpClient) {}

  getAllMaintenances(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getAvailableVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/available-vehicles`);
  }

  addMaintenance(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  deleteMaintenance(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
