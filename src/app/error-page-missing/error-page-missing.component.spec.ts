import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPageMissingComponent } from './error-page-missing.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

describe('ErrorPageMissingComponent', () => {
  let component: ErrorPageMissingComponent;
  let fixture: ComponentFixture<ErrorPageMissingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorPageMissingComponent ]
      , imports: [RouterModule]
      , schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageMissingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
