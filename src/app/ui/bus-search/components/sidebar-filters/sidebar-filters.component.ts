import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-filters',
  templateUrl: './sidebar-filters.component.html',
  styleUrl: './sidebar-filters.component.css'
})
export class SidebarFiltersComponent {
  startTime: string = '';
  endTime: string = '';


  // Price Range
  priceRange: number[] = [300, 800];

  // Facilities
  facilities = [
    { name: 'Meal', icon: 'pi pi-apple' },
    { name: 'Socket', icon: 'pi pi-plug' },
    { name: 'Television', icon: 'pi pi-tv' },
    { name: 'Toilet', icon: 'pi pi-camera' },
    { name: 'Baggage', icon: 'pi pi-briefcase' },
    { name: 'Wifi', icon: 'pi pi-wifi' },
  ];
  selectedFacilities: string[] = [];

  toggleFacility(facility: any): void {
    const index = this.selectedFacilities.indexOf(facility.name);
    if (index === -1) {
      this.selectedFacilities.push(facility.name);
    } else {
      this.selectedFacilities.splice(index, 1);
    }
  }

  // Discount Dropdown
  discountTypes = [
    { name: 'Percentage', value: 'percentage' },
    { name: 'Flat Rate', value: 'flat_rate' },
  ];
  selectedDiscount: any;
}
