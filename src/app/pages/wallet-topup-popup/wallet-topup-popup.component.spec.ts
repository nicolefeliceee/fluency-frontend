import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTopupPopupComponent } from './wallet-topup-popup.component';

describe('WalletTopupPopupComponent', () => {
  let component: WalletTopupPopupComponent;
  let fixture: ComponentFixture<WalletTopupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletTopupPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WalletTopupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
