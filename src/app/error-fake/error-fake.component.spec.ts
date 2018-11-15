import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFakeComponent } from './error-fake.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';

describe('ErrorFakeComponent', () => {
  let component: ErrorFakeComponent;
  let fixture: ComponentFixture<ErrorFakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorFakeComponent ]
      , schemas: [ NO_ERRORS_SCHEMA ]
      , providers: [ OrderService
        //        { provide: TwainService, useValue: twainService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
