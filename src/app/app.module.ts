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

import { AuthHttpClient } from './services/auth-http-client.service';
import { LoadingPanelComponent } from './loading-panel/loading-panel.component';
import { ErrorFakeComponent } from './error-fake/error-fake.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    CheckoutStartComponent,
    CheckoutComponent,
    ErrorPageMissingComponent,
    CheckoutCompleteComponent,
    LoadingPanelComponent,
    ErrorFakeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthHttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
