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
            label: 'Reports',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/dashboard/reports']
          },
          {
            label: 'Trips',
            icon: 'pi pi-receipt',
            routerLink: ['/dashboard/trips']
          },
          {
            label: 'Routes',
            icon: 'pi pi-map',
            routerLink: ['/dashboard/routes']
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
          {
            label: 'Users', icon: 'pi pi-users',
            items: [
              {
                label: 'Drivers',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/dashboard/drivers']
              },
              {
                label: 'Admins',
                icon: 'pi pi-shield',
                routerLink: ['/dashboard/admins']
              },
              {
                label: 'Customers',
                icon: 'pi pi-ticket',
                routerLink: ['/dashboard/customers']
              },
            ]
          },
        ]
      },
    ];
  }
}
