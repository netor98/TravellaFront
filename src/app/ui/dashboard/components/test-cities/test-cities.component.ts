import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../../../services/auth.service";
import {environment} from "../../../../../environments/environment.development";

@Component({
  selector: 'app-test-cities',
  templateUrl: './test-cities.component.html',
  styleUrl: './test-cities.component.css'
})
export class TestCitiesComponent implements OnInit {

  private readonly baseUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.http.get(`${this.baseUrl}/Cities`).subscribe((data) => {
      console.log(data);
    });
  }
}
