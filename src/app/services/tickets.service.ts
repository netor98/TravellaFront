import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private readonly baseUrl: string = environment.BASE_URL;
  constructor(private http: HttpClient) { }

  validateAndBoard(ticketId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/Tickets/validate-and-board`, {qrCodeData: ticketId}, {
    });
  }

  getRecentTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Tickets/recent`);
  }

  getTickets(
    pageNumber: number = 1,
    pageSize: number = 10,
    startDate?: Date | null,
    endDate?: Date | null,
    statusId?: string,
    userId?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }

    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }

    if (statusId) {
      params = params.set('statusId', statusId);
    }

    if (userId) {
      params = params.set('userId', userId);
    }

    return this.http.get<any>(`${this.baseUrl}/Tickets`, { params });
  }
}
