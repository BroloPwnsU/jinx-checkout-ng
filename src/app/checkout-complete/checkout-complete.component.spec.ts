import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCompleteComponent } from './checkout-complete.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { LoadingPanelComponent } from '../loading-panel/loading-panel.component';
import { CheckoutHeaderComponent } from '../checkout-header/checkout-header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HistoryService } from '../services/history.service';
import { UserService } from '../services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('CheckoutCompleteComponent', () => {
  let component: CheckoutCompleteComponent;
  let fixture: ComponentFixture<CheckoutCompleteComponent>;

  beforeEach(async(() => {

    let userService = jasmine.createSpyObj("UserService", ["logoutAmazonPay"]);
    let userServiceLogoutAmazonPay = userService.logoutAmazonPay;

    let historyService = jasmine.createSpyObj("HistoryService", ["getAll"]);
    let historyServiceGetAll = historyService.getAll;

    TestBed.configureTestingModule({
      declarations: [ 
        CheckoutCompleteComponent
        , OrderDetailComponent
        , LoadingPanelComponent
        , CheckoutHeaderComponent
       ]
       , providers: [
         {provide: HistoryService, useValue: historyService}
         , {provide: UserService, useValue: userService}
       ]
       , imports: [HttpClientModule]
       , schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
