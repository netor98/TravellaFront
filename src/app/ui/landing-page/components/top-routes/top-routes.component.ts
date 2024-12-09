import {Component, OnInit} from '@angular/core';
import {RoutesService} from "../../../../services/routes.service";
import {TopRoutesDto} from "../../../../domain/models/TopRoutesDto";

@Component({
  selector: 'top-routes',
  templateUrl: './top-routes.component.html',
  styleUrl: './top-routes.component.css'
})
export class TopRoutesComponent implements OnInit {
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  products = [
    {
      id: '1',
      name: 'New York',
      code: 'NY',
      country: 'USA',
      imageUrl: 'assets/images/new-york.jpg'
    },
    {
      id: '1',
      name: 'New York',
      code: 'NY',
      country: 'USA',
      imageUrl: 'assets/images/new-york.jpg'
    },
    {
      id: '1',
      name: 'New York',
      code: 'NY',
      country: 'USA',
      imageUrl: 'assets/images/new-york.jpg'
    },
    {
      id: '1',
      name: 'New York',
      code: 'NY',
      country: 'USA',
      imageUrl: 'assets/images/new-york.jpg'
    },
    {
      id: '1',
      name: 'New York',
      code: 'NY',
      country: 'USA',
      imageUrl: 'assets/images/new-york.jpg'
    },
    {
      id: '1',
      name: 'New York',
      code: 'NY',
      country: 'USA',
      imageUrl: 'assets/images/new-york.jpg'
    }
  ]
  routes: TopRoutesDto[] = [];

  constructor(private routesService: RoutesService) {
  }

  ngOnInit(): void {
    this.routesService.getTopRoutes().subscribe((topRoutes) => {
      this.routes = topRoutes;
    });
  }
}
