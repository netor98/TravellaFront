import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Product} from "../../../../../../assets/demo/demo/api/product";
import {debounceTime, Subscription} from "rxjs";
import {
  ProductService
} from "../../../../../../assets/demo/demo/service/product.service";
import {LayoutService} from "../../../../../layout/service/app.layout.service";
import {AdminService} from "../../../../../services/admin.service";

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrl: './my-page.component.css'
})
export class MyPageComponent implements OnInit, OnDestroy {

  items!: MenuItem[];

  products!: Product[];

  chartData: any;

  chartOptions: any;

  subscription!: Subscription;
  ordersCount: number = 0;
  customersCount: number = 0;
  revenue: number = 0;
  ordersByMonth: number[] = [];
  months: string[] = [];

  constructor(private productService: ProductService,
              public layoutService: LayoutService,
              private adminService: AdminService) {


  }

  ngOnInit() {
    this.adminService.getOrdersCount().subscribe((data: number) => {
      this.ordersCount = data;
    });

    this.adminService.getCustomerCount().subscribe((data: number) => {
      this.customersCount = data;
    });

    this.adminService.getRevenueOrders().subscribe((data: number) => {
      this.revenue = data;
    });

    this.adminService.getOrdersCountByMonth().subscribe((data) => {
      this.months = data.map(d => this.getMonthName(d.month));
      this.ordersByMonth = data.map(d => d.count);
      this.initChart();
    });

    this.items = [
      {label: 'Add New', icon: 'pi pi-fw pi-plus'},
      {label: 'Remove', icon: 'pi pi-fw pi-minus'}
    ];
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: this.months,
      datasets: [
        {
          label: 'Orders',
          data: this.ordersByMonth,
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: .4
        },
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  getMonthName(month: number): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month - 1];
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


