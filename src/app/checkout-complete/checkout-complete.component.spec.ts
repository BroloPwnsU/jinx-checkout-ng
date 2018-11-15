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
    TestBed.configureTestingModule({
      declarations: [ 
        CheckoutCompleteComponent
        , OrderDetailComponent
        , LoadingPanelComponent
        , CheckoutHeaderComponent
       ]
       , providers: [
         HistoryService
         , UserService
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
