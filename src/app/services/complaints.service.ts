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

  getComplaints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Complaints`);
  }

  // Add a new complaint
  addComplaint(complaint: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Complaints`, complaint);
  }

  // Update an existing complaint
  updateComplaint(id: string, complaint: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Complaints/${id}`, complaint);
  }

  // Delete a complaint
  deleteComplaint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Complaints/${id}`);
  }



  // Fetch complaints by status
  getComplaintsByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/Complaints/status/${status}`
    );
  }



  getComplaintsCount(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/Complaints/count`
    );
  }

  respondToComplaint(id: string, resolutionDetails: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/Complaints/respond/${id}`, { resolutionDetails });
  }


  // Fetch complaints by date range
  getComplaintsByDateRange(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/Complaints/date-range?start=${startDate}&end=${endDate}`
    );
  }
}
