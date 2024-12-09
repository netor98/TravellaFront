import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Complaint} from "../domain/models/Complaint";
import {ComplaintTypeResponse} from "../domain/models/ComplaintTypeResponse";

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {
  private readonly baseUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) {
  }

  getComplaintsByUser(userId: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.baseUrl}/Complaints/user/${userId}`);
  }

  getComplaintsTypes(): Observable<ComplaintTypeResponse[]> {
    return this.http.get<ComplaintTypeResponse[]>(`${this.baseUrl}/Complaints/complaintTypes`);
  }

  submitComplaint(complaint: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Complaints`, complaint);
  }
}
