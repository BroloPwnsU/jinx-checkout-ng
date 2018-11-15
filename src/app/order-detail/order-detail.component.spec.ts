import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailComponent } from './order-detail.component';
import { MatButtonModule } from '@angular/material/button';
import { OrderItemListComponent } from '../order-item-list/order-item-list.component';
import { ProductImageComponent } from '../product-image/product-image.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailComponent, OrderItemListComponent, ProductImageComponent ]
      , imports: [MatButtonModule]
      , schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
