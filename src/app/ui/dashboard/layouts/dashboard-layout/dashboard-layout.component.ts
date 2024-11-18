import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment.development";

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styles: ``
})
export class DashboardLayoutComponent implements OnInit {
  public user = this.authService.currentUser();
  public cities: any;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  ngOnInit(): void {

  }

  onLogout(): void {
    this.authService.logout();
  }

}
