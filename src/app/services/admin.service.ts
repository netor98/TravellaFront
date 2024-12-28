import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl: string = environment.BASE_URL;


  constructor(private http: HttpClient) {
  }

  getOrdersCount() {
    return this.http.get<number>(`${this.baseUrl}/Orders/count`);
  }


  getCustomerCount() {
    return this.http.get<number>(`${this.baseUrl}/Users/count`);
  }

  getRevenueOrders() {
    return this.http.get<number>(`${this.baseUrl}/Orders/revenue`);
  }

  getOrdersCountByMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Orders/count-by-month`);
  }


}
