import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
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
  styleUrl: './app.component.css',

})
export class AppComponent implements OnInit {
  public loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isDashboard = event.url === '/dashboard';
        this.toggleDashboardStyles(isDashboard);
      }
    })


    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => {
          this.loading = false;
        }, 2000)
      }
    });
  }

  public toggleDashboardStyles(enable: boolean): void {
    const themeId = 'theme-css';
    let themeLink = document.getElementById(themeId) as HTMLLinkElement;
    const defaultTheme = 'assets/layout/styles/theme/lara-light-indigo/theme.css';


    if (defaultTheme !== themeLink.getAttribute('href')) {
      themeLink.setAttribute('href', defaultTheme);
      console.log(themeLink)
    }
  }


}


