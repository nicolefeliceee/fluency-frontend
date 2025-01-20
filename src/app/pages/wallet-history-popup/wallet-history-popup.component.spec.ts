import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletHistoryPopupComponent } from './wallet-history-popup.component';

describe('WalletHistoryPopupComponent', () => {
  let component: WalletHistoryPopupComponent;
  let fixture: ComponentFixture<WalletHistoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletHistoryPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WalletHistoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
