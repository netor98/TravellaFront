import {Component, Input} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'password-strength',
  templateUrl: './password-strength-popup.component.html',
  styleUrl: './password-strength-popup.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms 0s', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('200ms 0s', style({opacity: 0}))
      ])
    ])
  ]
})
export class PasswordStrengthPopupComponent {
  @Input() isPopupVisible: boolean = false;
  @Input() passwordValidLength: boolean = false;
  @Input() passwordHasNumber: boolean = false;
  @Input() passwordHasLowerCase: boolean = false;
  @Input() passwordHasUpperCase: boolean = false;
  @Input() passwordHasSpecialChar: boolean = false;
}
