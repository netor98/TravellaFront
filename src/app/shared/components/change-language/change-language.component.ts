import {Component} from '@angular/core';
import {Overlay} from "primeng/overlay";
import {OverlayPanel} from "primeng/overlaypanel";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'change-language',
  templateUrl: './change-language.component.html',
  styleUrl: './change-language.component.css'
})
export class ChangeLanguageComponent {
  public selectedLanguage = 'en';
  public languages: string[] = [
    'en', 'es', 'fr'
  ];
  public isLanguageMenuOpen: boolean = false

  constructor(private router: Router) {
  }


  public isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  public toggleMenu(event: Event, menuPanel: OverlayPanel): void {
    menuPanel.toggle(event);
  }

  public selectLanguage(language: string): void {
    this.selectedLanguage = language;
    this.isLanguageMenuOpen = false;
  }
}
