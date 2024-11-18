import {Component, computed, effect, inject, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {
  NavigationCancel,
  NavigationEnd, NavigationError,
  NavigationStart,
  Router
} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show spinner on route change start
        this.loading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        // Hide spinner on route change end
        setTimeout(() => {
          this.loading = false;
        }, 2000)
      }
    });
  }
}
