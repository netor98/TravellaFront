import {Component} from '@angular/core';
import {ReportService} from "../../../../../services/report.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  revenueChartData: any;
  ticketChartData: any;
  chartOptions: any;

  constructor(private reportsService: ReportService) {}

  ngOnInit(): void {
    this.initChartOptions();
    this.fetchMonthlyRevenue();
    this.fetchTicketCount();
  }

  initChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  fetchMonthlyRevenue(): void {
    this.reportsService.getMonthlyRevenue().subscribe((data) => {
      const labels = data.map((item) => `${item.month}/${item.year}`);
      const revenues = data.map((item) => item.totalRevenue);

      this.revenueChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenues,
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            fill: false,
            tension: 0.4,
          },
        ],
      };
    });
  }

  fetchTicketCount(): void {
    this.reportsService.getTicketCount().subscribe((data) => {
      const labels = data.map((item) => `${item.month}/${item.year}`);
      const counts = data.map((item) => item.count);

      this.ticketChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Tickets Sold',
            data: counts,
            backgroundColor: '#66BB6A',
            borderColor: '#43A047',
            fill: false,
            tension: 0.4,
          },
        ],
      };
    });
  }
}
