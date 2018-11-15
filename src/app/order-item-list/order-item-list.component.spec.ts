import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemListComponent } from './order-item-list.component';
import { ProductImageComponent } from '../product-image/product-image.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from '../services/message.service';
import { OrderService } from '../services/order.service';
import { of } from 'rxjs';
import { Order } from '../classes/order';

describe('OrderItemListComponent', () => {
  let component: OrderItemListComponent;
  let fixture: ComponentFixture<OrderItemListComponent>;

  beforeEach(async(() => {

    let testOrder: Order = {};

    const orderService = jasmine.createSpyObj('OrderService', ['getOrder']);
    let getOrderSpy = orderService.getQuote.and.returnValue( of(testOrder) );

    TestBed.configureTestingModule({
      declarations: [ OrderItemListComponent, ProductImageComponent ]
      , providers: [
        { provide: MessageService, useValue: orderService }
      ]
      , schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
