import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFakeComponent } from './error-fake.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';

describe('ErrorFakeComponent', () => {
  let component: ErrorFakeComponent;
  let fixture: ComponentFixture<ErrorFakeComponent>;

  beforeEach(async(() => {

    let orderService = jasmine.createSpyObj("OrderService", ["setErrorFake"]);
    let orderServiceSetErrorFake = orderService.setErrorFake;

    TestBed.configureTestingModule({
      declarations: [ ErrorFakeComponent ]
      , schemas: [ NO_ERRORS_SCHEMA ]
      , providers: [ {provide: OrderService, useValue: orderService} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
