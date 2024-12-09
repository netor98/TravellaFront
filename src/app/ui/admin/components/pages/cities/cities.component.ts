import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CitiesService} from "../../../../../services/cities.service";
import {
  environment
} from "../../../../../../environments/environment.development";

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css'],
})
export class CitiesComponent implements OnInit {
  cities: any[] = [];
  displayModal: boolean = false;
  form: FormGroup;
  modalTitle: string = 'New City';
  editMode: boolean = false;
  selectedCityId: string | null = null;
  selectedFile: File | null = null;

  baseUrl: string = 'http://localhost:5289';
  constructor(private citiesService: CitiesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      cityImageUrl: [null],

    });
  }

  ngOnInit(): void {
    this.fetchCities();
  }

  fetchCities(): void {
    this.citiesService.getCities().subscribe({
      next: (data) => (this.cities = data),
      error: (err) => console.error('Error fetching cities:', err),
    });
  }

  openModal(): void {
    this.modalTitle = 'New City';
    this.editMode = false;
    this.form.reset();
    this.displayModal = true;
  }

  editCity(city: any): void {
    this.modalTitle = 'Edit City';
    this.editMode = true;
    this.selectedCityId = city.id;
    this.form.patchValue(city);
    this.displayModal = true;
  }

  closeModal(): void {
    this.displayModal = false;
    this.form.reset();
  }

  deleteCity(id: string): void {
    if (confirm('Are you sure you want to delete this city?')) {
      this.citiesService.deleteCity(id).subscribe(() => this.fetchCities());
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const city = this.form.value;
      if (this.editMode && this.selectedCityId) {
        this.citiesService.updateCity(this.selectedCityId, city).subscribe(() => {
          this.fetchCities();
          this.closeModal();
        });
      } else {
        this.citiesService.addCity(city).subscribe(() => {
          this.fetchCities();
          this.closeModal();
        });
      }
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }
}
