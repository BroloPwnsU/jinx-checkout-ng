import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutHeaderComponent } from './checkout-header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';

describe('CheckoutHeaderComponent', () => {
  let component: CheckoutHeaderComponent;
  let fixture: ComponentFixture<CheckoutHeaderComponent>;

  let userService = jasmine.createSpyObj("UserService", ["logoutAmazonPay"]);
  let userServiceLogoutAmazonPay = userService.logoutAmazonPay;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutHeaderComponent ]
      , imports: [MatButtonModule, MatIconModule, RouterModule, HttpClientModule]
      , schemas: [ NO_ERRORS_SCHEMA ]
      , providers: [ {provide: UserService, useValue: userService} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
