import {OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {LayoutService} from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

  model: any[] = [];

  constructor(public layoutService: LayoutService) {
  }

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/dashboard']
          },
          {
            label: 'Routes',
            icon: 'pi pi-map',
            routerLink: ['/dashboard/routes']
          },
          {
            label: 'Reports',
            icon: 'pi pi-chart-line',
            routerLink: ['/dashboard/reports']
          },
          {
            label: 'Sales',
            icon: 'pi pi-receipt',
            routerLink: ['/dashboard/sales']
          },
          {
            label: 'Cities',
            icon: 'pi pi-map-marker',
            routerLink: ['/dashboard/cities']
          },
          {
            label: 'Maitenance',
            icon: 'pi pi-wrench',
            routerLink: ['/dashboard/maintenance']
          },
          {
            label: 'Complaints',
            icon: 'pi pi-thumbs-down',
            routerLink: ['/dashboard/complaints']
          },
        ]
      },
    ];
  }
}
