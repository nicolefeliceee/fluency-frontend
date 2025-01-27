import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodPopupComponent } from './payment-method-popup.component';

describe('PaymentMethodPopupComponent', () => {
  let component: PaymentMethodPopupComponent;
  let fixture: ComponentFixture<PaymentMethodPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentMethodPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
