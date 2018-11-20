import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';
import { LoadingPanelComponent } from '../loading-panel/loading-panel.component';
import { CheckoutHeaderComponent } from '../checkout-header/checkout-header.component';
import { MatButtonModule } from '@angular/material/button';
import { ErrorFakeComponent } from '../error-fake/error-fake.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

import {MessageService} from '../services/message.service';
import {UserService} from '../services/user.service';
import {AmazonPayService} from '../services/amazon-pay.service';
import {OrderService} from '../services/order.service';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CheckoutComponent
        , LoadingPanelComponent
        , CheckoutHeaderComponent
        , ErrorFakeComponent 
      ]
      , imports: [
        MatButtonModule
        , RouterTestingModule
      ]
      , providers: [
        MessageService
        , UserService
        , AmazonPayService
        , OrderService
      ]
      , schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
