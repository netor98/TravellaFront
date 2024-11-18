import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {
  ChangeLanguageComponent
} from './components/change-language/change-language.component';
import {PrimegnModule} from "../primegn/primegn.module";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {
  PasswordStrengthPopupComponent
} from './components/password-strength-popup/password-strength-popup.component';


@NgModule({
  declarations: [
    NavBarComponent,
    ChangeLanguageComponent,
    PasswordStrengthPopupComponent
  ],
  exports: [
    NavBarComponent,
    ChangeLanguageComponent,
    PasswordStrengthPopupComponent
  ],
  imports: [
    CommonModule,
    PrimegnModule,
    RouterLink,
    FormsModule,
    NgOptimizedImage
  ]
})
export class SharedModule {
}
