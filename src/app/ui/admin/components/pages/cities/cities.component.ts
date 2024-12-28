import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CitiesService} from "../../../../../services/cities.service";
import {
  environment
} from "../../../../../../environments/environment.development";
import {MessageService} from "primeng/api";

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
  cityToDeleteId: string | null = null; // Store city ID to delete
  displayDeleteConfirm: boolean = false; // Flag for delete confirmation dialog


  baseUrl: string = 'http://localhost:5289';
  constructor(private citiesService: CitiesService, private fb: FormBuilder, private messageService: MessageService) {
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

  confirmDeleteCity(id: string): void {
    this.cityToDeleteId = id;
    this.displayDeleteConfirm = true; // Show the delete confirmation dialog
  }
  deleteCity(): void {
    if (this.cityToDeleteId) {
      this.citiesService.deleteCity(this.cityToDeleteId).subscribe({
        next: () => {
          this.fetchCities();
          this.cityToDeleteId = null;
          this.displayDeleteConfirm = false; // Hide the confirmation dialog
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'City deleted successfully.',
          });
        },
        error: (err) => console.error('Error deleting city:', err),
      });
    }
  }

  cancelDelete(): void {
    this.cityToDeleteId = null;
    this.displayDeleteConfirm = false; // Hide the confirmation dialog
  }

  onSubmit(): void {
    if (this.form.valid) {
      const city = this.form.value;
      if (this.editMode && this.selectedCityId) {
        this.citiesService.updateCity(this.selectedCityId, city).subscribe(() => {
          this.fetchCities();
          this.closeModal();
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'City updated successfully.',
          });
        });
      } else {
        console.log('Form submitted:', city);
        this.citiesService.addCity(city).subscribe(() => {
          this.fetchCities();
          this.closeModal();
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'City added successfully.',
          });
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
