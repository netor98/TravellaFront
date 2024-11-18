import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {
  RegisterPageComponent
} from './pages/register-page/register-page.component';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {RouterOutlet} from "@angular/router";
import {AuthRoutingModule} from "./auth-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LandingPageModule} from "../landing-page/landing-page.module";
import {PrimegnModule} from "../../primegn/primegn.module";
import {
  ForgotPasswordComponent
} from './pages/forgot-password/forgot-password.component';
import {
  ResetPasswordComponent
} from './pages/reset-password/reset-password.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    RegisterPageComponent,
    AuthLayoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PrimegnModule,
    LandingPageModule
  ]
})
export class AuthModule {
}
