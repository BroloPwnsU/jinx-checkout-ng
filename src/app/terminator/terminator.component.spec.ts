import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminatorComponent } from './terminator.component';

describe('TerminatorComponent', () => {
  let component: TerminatorComponent;
  let fixture: ComponentFixture<TerminatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
