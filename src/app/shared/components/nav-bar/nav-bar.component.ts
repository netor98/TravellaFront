import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, Observable} from 'rxjs';
import {AuthService} from "../../../services/auth.service";
import {CitiesModel} from "../../../domain/models/cities.model";
import {CitySearchService} from "../../../services/city-search.service";

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

  public loading: boolean = false;
  public isAuth: boolean = false;
  public searchQuery = '';
  public filteredCities: Observable<CitiesModel[]>;
  public isAuthRoute: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private citySearchService: CitySearchService
  ) {
    this.filteredCities = this.citySearchService.getFilteredCities(this.searchQuery);
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isAuthRoute = this.router.url.startsWith('/auth');
    });
    this.isAuth = this.authService.authStatus()() === 'authenticated';
  }

  public menuOpen: boolean = false;


  public isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }


  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  public async onLogOut(): Promise<void> {
    this.loading = true;
    this.authService.logout();
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.loading = false;
    this.isAuth = false;
  }

  public onSearchChange() {
    this.citySearchService.setSearchQuery(this.searchQuery);
    this.filteredCities = this.citySearchService.getFilteredCities(this.searchQuery);
  }

  public selectCity(cityName: string) {
    this.searchQuery = cityName;
    setTimeout(() => {
      this.searchQuery = '';
    }, 100);
    //TODO: search the destination without origin
    this.citySearchService.setSearchQuery('');
  }

}
