import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment.development";
import {Ticket} from "../domain/models/Ticket";

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private readonly baseUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) {
  }

  getTicketsByUser(userId: string): Observable<Ticket[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Tickets/ByUser/${userId}`);
  }
}
