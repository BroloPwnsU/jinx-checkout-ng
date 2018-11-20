import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { CheckoutStartComponent } from './checkout-start/checkout-start.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutCompleteComponent } from './checkout-complete/checkout-complete.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TerminatorComponent } from './terminator/terminator.component';
import { ErrorPageMissingComponent } from './error-page-missing/error-page-missing.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
        , MessagesComponent
        , CheckoutStartComponent
        , CheckoutComponent
        , CheckoutCompleteComponent
        , TerminatorComponent
        , ErrorPageMissingComponent
      ]
      , imports: [AppRoutingModule]
      , schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  /*
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'jinx-checkout-ng'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('jinx-checkout-ng');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to jinx-checkout-ng!');
  });
  */
});
