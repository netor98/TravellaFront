import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

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
export class DestinationLinkComponent {
  showAll: boolean = false;


  destinations: string[] = [
    'Ciudad de México',
    'Bali',
    'Bandung',
    'Yogyakarta',
    'Surabaya',
    'Medan',
    'Semarang',
    'Makassar',
    'Palembang',
    'Manado',
    'Malang',
    'Bogor',
    'Batam',
    'Pontianak',
    'Balikpapan',
    'Samarinda',
    'Padang',
    'Bandar Lampung',
    'Banjarmasin',
    'Ambon',
  ];

  get visibleDestinations(): string[] {
    return this.showAll ? this.destinations : this.destinations.slice(0, 4);
  }


  toggleSeeMore(): void {
    this.showAll = !this.showAll;
  }
}
