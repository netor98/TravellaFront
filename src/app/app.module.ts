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
import {
  BrowserAnimationsModule,
  provideAnimations
} from "@angular/platform-browser/animations";
import {
  TokenInterceptorServiceService
} from "./services/token-interceptor-service.service";
import {BookingComponent} from './ui/booking/booking.component';
import {FormsModule} from "@angular/forms";
import {BookingModule} from "./ui/booking/booking.module";
import {AppLayoutModule} from "./layout/app.layout.module";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    LandingPageModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    BookingModule,
    AppLayoutModule,
  ],
  providers: [
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorServiceService,
      multi: true
    },
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
