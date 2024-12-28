import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RoutesService} from "../../../../../services/routes.service";
import {CitiesService} from "../../../../../services/cities.service";

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent {
  routes: any[] = [];
  cities: any[] = []; // Populate this with city data from your backend
  displayModal = false;
  form: FormGroup;
  editMode = false;
  selectedRouteId: string | null = null;
  routesTableData: any[] = [];
  constructor(private routesService: RoutesService, private fb: FormBuilder, private citiesService: CitiesService) {
    this.form = this.fb.group({
      originId: ['', Validators.required],
      destinationId: ['', Validators.required],
      distance: ['', Validators.required],
      duration: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchRoutes();
    this.fetchCities();
  }

  fetchRoutes(): void {
    this.routesService.getAllRoutes().subscribe((data) => {
      this.routes = data;
      this.routesTableData = this.routes.map(route => ({
        id: route.id,
        originName: route.origin.name,
        destinationName: route.destination.name,
        distance: route.distance,
        duration: route.duration,
        code: route.code,
        country: route.country,
        state: route.state
      }));
    });
  }

  fetchCities(): void {
    this.citiesService.getCities().subscribe((data) => {
      this.cities = data;
    });
    // Call a cities service to get all cities
  }

  openModal(): void {
    this.form.reset();
    this.editMode = false;
    this.displayModal = true;
  }

  editRoute(route: any): void {
    this.selectedRouteId = route.id;
    this.editMode = true;
    this.form.patchValue(route);
    this.displayModal = true;
  }

  saveRoute(): void {
    if (this.form.valid) {
      const route = this.form.value

      if (this.editMode && this.selectedRouteId) {

        this.routesService.updateRoute(this.selectedRouteId, route).subscribe(() => {
          this.fetchRoutes();
          this.displayModal = false;
        });
      } else {
        console.log(route);
        this.routesService.addRoute(route).subscribe(() => {
          this.fetchRoutes();
          this.displayModal = false;
        });
      }
    }
  }

  deleteRoute(id: string): void {
    if (confirm('Are you sure you want to delete this route?')) {
      this.routesService.deleteRoute(id).subscribe(() => {
        this.fetchRoutes();
      });
    }
  }
}
