import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
import { WalletService } from '../../../../services/wallet.service';
import { PriceFormattingDirective } from '../../../../components/price-formatting.directive';

@Component({
  selector: 'app-payment-method-popup',
  standalone: true,
  imports: [CommonModule, PriceFormattingDirective],
  providers: [DecimalPipe],
  templateUrl: './payment-method-popup.component.html',
  styleUrl: './payment-method-popup.component.css'
})
export class PaymentMethodPopupComponent implements OnInit {

  constructor(
    private walletService: WalletService,
    private decimalPipe: DecimalPipe
  ) {

  }

  walletHeader: any;

  ngOnInit(): void {
    this.walletService.getWalletInfo().subscribe(
      data => {
        console.log(data);
        this.walletHeader = data;
      },
      error => {
        console.log(error);
      }
    )

  }

  @Input() display: boolean = false;
    @Input() header!: string;
    @Input() media!: string;
    @Input() id!: number;
    @Input() inputForm!: any;
    @Input() orderSummary!: any;
    cancelClicked = output<any>();
  confirmClicked = output<any>();

  balanceInsufficientError: boolean = false;


  cancel() {
    this.cancelClicked.emit(true);
  }

  // for radio button
  walletSelected: boolean = false;
  otherSelected: boolean = false;
  selectWallet() {
    this.otherSelected = false;
    this.walletSelected = true;
    if (this.orderSummary.totalAmount > this.walletHeader['balance']) {
      this.balanceInsufficientError = true;
    }
  }

  selectOther() {
    this.otherSelected = true;
    this.walletSelected = false;
    this.balanceInsufficientError = false;
  }

  checkout() {
    if (this.walletSelected) {
      this.confirmClicked.emit("wallet");
    } else if(this.otherSelected) {
      this.confirmClicked.emit("other");
    }
  }

  formatPrice(price: any) {
    let formatted = this.decimalPipe.transform(price, '1.0-0');
    return formatted!.replace(/,/g, '.');
  }

}
