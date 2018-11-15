import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutStartComponent } from './checkout-start.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { LoadingPanelComponent } from '../loading-panel/loading-panel.component';
import { OrderItemListComponent } from '../order-item-list/order-item-list.component';
import { ErrorFakeComponent } from '../error-fake/error-fake.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { AmazonPayService } from '../services/amazon-pay.service';
import { OrderService } from '../services/order.service';
import { of } from 'rxjs';

describe('CheckoutComponent', () => {
  let component: CheckoutStartComponent;
  let fixture: ComponentFixture<CheckoutStartComponent>;  

  beforeEach(async(() => {
    let testQuote = 'Test Quote';

    // Create a fake UserService object with a `getQuote()` spy
    const userService = jasmine.createSpyObj('UserService', ['getQuote']);
    // Make the spy return a synchronous Observable with the test data
    let getQuoteSpy = userService.getQuote.and.returnValue( of(testQuote) );

    const messageService = jasmine.createSpyObj('MessageService', []);
    const amazonPayService = jasmine.createSpyObj('AmazonPayService', []);
    const orderService = jasmine.createSpyObj('OrderService', []);
    
    TestBed.configureTestingModule({
      declarations: [ CheckoutStartComponent, LoadingPanelComponent, OrderItemListComponent, ErrorFakeComponent],
      imports: [MatProgressSpinnerModule, MatIconModule, RouterModule]
      , providers: [
        { provide: MessageService, useValue: messageService }
        ,{ provide: UserService, useValue: userService }
        ,{ provide: AmazonPayService, useValue: amazonPayService }
        ,{ provide: OrderService, useValue: orderService } 
      ]
      , schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
