import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageComponent } from './product-image.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingPanelComponent } from '../loading-panel/loading-panel.component';
import { MatCardModule } from '@angular/material/card';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from '../services/message.service';

describe('ProductImageComponent', () => {
  let component: ProductImageComponent;
  let fixture: ComponentFixture<ProductImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImageComponent, LoadingPanelComponent ]
      , imports: [MatIconModule, MatProgressSpinnerModule, MatCardModule]
      , providers: [MessageService]
      , schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make good urls', () => {
    component.imageFolder = 'https://mock/whatever/';
    component.size = '200';

    expect(component.getImageUrl()).toBe(
      'https://mock/whatever/200.jpg'
    );
  });
});
