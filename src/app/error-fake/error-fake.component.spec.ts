import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFakeComponent } from './error-fake.component';

describe('ErrorFakeComponent', () => {
  let component: ErrorFakeComponent;
  let fixture: ComponentFixture<ErrorFakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorFakeComponent ]
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
