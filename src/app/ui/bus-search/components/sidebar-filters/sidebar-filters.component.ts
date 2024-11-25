import {Component} from '@angular/core';
import {FiltersTripsService} from "../../../../services/filters-trips.service";

@Component({
  selector: 'app-sidebar-filters',
  templateUrl: './sidebar-filters.component.html',
  styleUrl: './sidebar-filters.component.css'
})
export class SidebarFiltersComponent {
  startTime: string = '';
  endTime: string = '';
  time: Date[] | undefined;


  // Price Range
  priceRange: number[] = [300, 800];


  // Discount Dropdown
  discountTypes = [
    {name: 'Percentage', value: 'percentage'},
    {name: 'Flat Rate', value: 'flat_rate'},
  ];
  selectedDiscount: any;


  constructor(
    private filtersService: FiltersTripsService
  ) {
  }


  updateFilters(): void {
    this.filtersService.updateFilters({
      timeRange: [this.startTime, this.endTime],
      priceRange: this.priceRange,
      discountType: this.selectedDiscount
    });
  }
}
