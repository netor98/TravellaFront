import {Component} from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styles: ``
})
export class PageComponent {
  visible: boolean = false;
  members = [
    {name: 'John Doe', age: 30, email: 'asd', image: 'asd', role: 'as'},

  ]

  showDialog() {
    this.visible = true;
  }
}
