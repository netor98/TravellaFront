import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { CitiesService } from '../../../../services/cities.service';
import {CitiesModel} from "../../../../domain/models/cities.model";

@Component({
  selector: 'app-destination-link',
  templateUrl: './destination-link.component.html',
  styleUrl: './destination-link.component.css',
  animations: [
    trigger('toggleAnimation', [
      state(
        'collapsed',
        style({
          height: '0px',
          overflow: 'hidden',
          opacity: 0,
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          overflow: 'hidden',
          opacity: 1,
        })
      ),
      transition('collapsed <=> expanded', [animate('600ms ease-in-out')]),
    ]),
  ],
})
export class DestinationLinkComponent implements OnInit{
  showAll: boolean = false;
  destinations: CitiesModel[] = [];
  constructor(private citiesService: CitiesService) {
  }

  ngOnInit(): void {
    this.citiesService.getCities().subscribe({
      next: (cities) => {
        this.destinations = cities;
      },
      error: (err) => {
        console.error(err);
      },
    });
    }


  get visibleDestinations(): CitiesModel[] {
    return this.showAll ? this.destinations : this.destinations.slice(0, 4);
  }


  toggleSeeMore(): void {
    this.showAll = !this.showAll;
  }
}
