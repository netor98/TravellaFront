import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {OrderDto} from "../domain/models/OrderDto";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  private readonly baseUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  createPaymentIntent(order: OrderDto): Observable<any> {
    console.log(order)
    return this.http.post(`${this.baseUrl}/Payments`, order);
  }



}
