import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDescComponent } from './stock-desc.component';

describe('StockDescComponent', () => {
  let component: StockDescComponent;
  let fixture: ComponentFixture<StockDescComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDescComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
