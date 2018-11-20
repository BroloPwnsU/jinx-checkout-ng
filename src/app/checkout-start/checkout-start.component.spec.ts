import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutStartComponent } from './checkout-start.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { LoadingPanelComponent } from '../loading-panel/loading-panel.component';
import { OrderItemListComponent } from '../order-item-list/order-item-list.component';
import { ErrorFakeComponent } from '../error-fake/error-fake.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { AmazonPayService } from '../services/amazon-pay.service';
import { OrderService } from '../services/order.service';
import { of } from 'rxjs';
import { Order } from '../classes/order';

describe('CheckoutStartComponent', () => {
  let component: CheckoutStartComponent;
  let fixture: ComponentFixture<CheckoutStartComponent>;  

  let testOrder: Order;
  let amazonPaySellerId: string;
  let amazonPayIsLoaded: boolean;

  let buildTestOrder = () => {
    let fakeOrder = new Order();
    fakeOrder.orderReferenceId = 'dude';
    return fakeOrder;
  }

  beforeEach(async(() => {

    amazonPayIsLoaded = true;
    amazonPaySellerId = '12345';
    testOrder = buildTestOrder();


    // Make the spy return a synchronous Observable with the test data
    //let getQuoteSpy = userService.getQuote.and.returnValue( of(testQuote) );

    const userService = jasmine.createSpyObj('UserService', ['setUserAuth', 'logoutAmazonPay']);
    let userServiceSetUserAuthSpy = userService.setUserAuth;
    let userServiceLogoutAmazonPaySpy = userService.logoutAmazonPay;

    const messageService = jasmine.createSpyObj('MessageService', ['debug', 'add']);
    let messageServiceDebugSpy = messageService.debug;
    let messageServiceAddSpy = messageService.add;

    const amazonPayService = jasmine.createSpyObj('AmazonPayService', ['getIsLoaded', 'getSellerId']);
    let amazonPayServiceGetIsLoaded = amazonPayService.getIsLoaded.and.returnValue(of(true));
    let amazonPayServiceGetSellerId = amazonPayService.getSellerId.and.returnValue(amazonPaySellerId);
    
    const orderService = jasmine.createSpyObj('OrderService', ['getOrder']);
    let orderServiceGetOrder = orderService.getOrder.and.returnValue(of(testOrder));
    
    TestBed.configureTestingModule({
      declarations: [ CheckoutStartComponent, LoadingPanelComponent, OrderItemListComponent, ErrorFakeComponent],
      imports: [MatProgressSpinnerModule, MatIconModule, RouterTestingModule]
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
