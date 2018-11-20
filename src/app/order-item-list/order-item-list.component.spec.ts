import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemListComponent } from './order-item-list.component';
import { ProductImageComponent } from '../product-image/product-image.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from '../services/message.service';
import { OrderService } from '../services/order.service';
import { of } from 'rxjs';
import { Order } from '../classes/order';
import { OrderItem } from '../classes/order-item';

describe('OrderItemListComponent', () => {
  let component: OrderItemListComponent;
  let fixture: ComponentFixture<OrderItemListComponent>;

  let testOrderReferenceId = "dude";
  let orderService: OrderService;

  beforeEach(async(() => {

    let testOrder: Order = new Order();
    testOrder.orderReferenceId = testOrderReferenceId;

    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['getOrder']);
    orderServiceSpy.getOrder.and.returnValue( of(testOrder) );

    TestBed.configureTestingModule({
      declarations: [ OrderItemListComponent, ProductImageComponent ]
      , providers: [
        { provide: OrderService, useValue: orderServiceSpy }
        , MessageService
      ]
      , schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    orderService = TestBed.get(OrderService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemListComponent);
    component = fixture.componentInstance;

    let order = new Order();
    order.orderReferenceId = '1234';

    let orderItem0 = new OrderItem();
    orderItem0.productId = 100;
    orderItem0.colorId = 200; 
    
    let orderItem1 = new OrderItem();
    orderItem1.productId = 100;
    orderItem1.colorId = 200; 

    order.items = [orderItem0, orderItem1];

    component.order = order;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use OrderService',
    (done: DoneFn) => {
      let testOrder = new Order();
      testOrder.orderReferenceId = testOrderReferenceId;
      orderService.getOrder().subscribe(value => {
        expect(value).toEqual(testOrder);
        done();
      });
  });

  it('should make a good photo url', () => {
    let orderItem = new OrderItem();
    orderItem.productId = 12;
    orderItem.colorId = 5;

    expect(component.getPhotoStub(orderItem)).toBe(
      'https://www.jinx.com/productimage/12/5/1/'
    );
  });
});
