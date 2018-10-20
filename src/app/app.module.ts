import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MessagesComponent } from './messages/messages.component';
import { CheckoutStartComponent } from './checkout-start/checkout-start.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ErrorPageMissingComponent } from './error-page-missing/error-page-missing.component';
import { CheckoutCompleteComponent } from './checkout-complete/checkout-complete.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    CheckoutStartComponent,
    CheckoutComponent,
    ErrorPageMissingComponent,
    CheckoutCompleteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
