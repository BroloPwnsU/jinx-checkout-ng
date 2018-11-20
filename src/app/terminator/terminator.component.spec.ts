import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminatorComponent } from './terminator.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TerminatorComponent', () => {
  let component: TerminatorComponent;
  let fixture: ComponentFixture<TerminatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminatorComponent ]
      , imports: [MatButtonModule, MatIconModule]
      , schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
