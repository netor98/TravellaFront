import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MaintenanceService} from "../../../../../services/maintenance.service";

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent implements OnInit {
  maintenances: any[] = [];
  availableVehicles: any[] = [];
  displayModal = false;
  form: FormGroup;

  constructor(
    private maintenanceService: MaintenanceService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      vehicleId: ['', Validators.required],
      date: ['', Validators.required],
      costs: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchMaintenances();
    this.fetchAvailableVehicles();
  }

  fetchMaintenances(): void {
    this.maintenanceService.getAllMaintenances().subscribe((data) => {
      this.maintenances = data;
    });
  }

  fetchAvailableVehicles(): void {
    this.maintenanceService.getAvailableVehicles().subscribe((data) => {
      this.availableVehicles = data;
    });
  }

  openModal(): void {
    this.displayModal = true;
    this.form.reset();
  }

  addMaintenance(): void {
    if (this.form.valid) {
      const maintenance = this.form.value;
      maintenance.date = new Date(maintenance.date).toISOString();

      this.maintenanceService.addMaintenance(maintenance).subscribe(() => {
        this.fetchMaintenances();
        this.displayModal = false;
      });
    }
  }

  deleteMaintenance(id: string): void {
    if (confirm('Are you sure you want to delete this maintenance record?')) {
      this.maintenanceService.deleteMaintenance(id).subscribe(() => {
        this.fetchMaintenances();
      });
    }
  }
}
