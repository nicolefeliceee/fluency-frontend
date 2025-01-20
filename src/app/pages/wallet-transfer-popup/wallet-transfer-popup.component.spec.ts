import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTransferPopupComponent } from './wallet-transfer-popup.component';

describe('WalletTransferPopupComponent', () => {
  let component: WalletTransferPopupComponent;
  let fixture: ComponentFixture<WalletTransferPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletTransferPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WalletTransferPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
