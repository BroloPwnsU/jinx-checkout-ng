import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { MessagesComponent } from './messages/messages.component';
import { CheckoutStartComponent } from './checkout-start/checkout-start.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ErrorPageMissingComponent } from './error-page-missing/error-page-missing.component';
import { CheckoutCompleteComponent } from './checkout-complete/checkout-complete.component';

import { AuthHttpClient } from './services/auth-http-client.service';
import { LoadingPanelComponent } from './loading-panel/loading-panel.component';
import { ErrorFakeComponent } from './error-fake/error-fake.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { TerminatorComponent } from './terminator/terminator.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    CheckoutStartComponent,
    CheckoutComponent,
    ErrorPageMissingComponent,
    CheckoutCompleteComponent,
    LoadingPanelComponent,
    ErrorFakeComponent,
    OrderDetailComponent,
    TerminatorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTableModule,
    MatListModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [AuthHttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
