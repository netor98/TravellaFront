import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient
} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {LandingPageModule} from "./ui/landing-page/landing-page.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  TokenInterceptorServiceService
} from "./services/token-interceptor-service.service";
import { BookingComponent } from './ui/booking/booking.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    LandingPageModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorServiceService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
