import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Order} from "../domain/models/Order";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private readonly baseUrl: string = environment.BASE_URL;


  constructor(private http: HttpClient) {
  }

  public getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/Orders/user/${userId}`);
  }


  public getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/Orders/${orderId}`);
  }
}
