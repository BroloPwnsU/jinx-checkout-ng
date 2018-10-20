import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPageMissingComponent } from './error-page-missing.component';

describe('ErrorPageMissingComponent', () => {
  let component: ErrorPageMissingComponent;
  let fixture: ComponentFixture<ErrorPageMissingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorPageMissingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageMissingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
