import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-payment-method-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-method-popup.component.html',
  styleUrl: './payment-method-popup.component.css'
})
export class PaymentMethodPopupComponent {

  @Input() display: boolean = false;
    @Input() header!: string;
    @Input() media!: string;
    @Input() id!: number;
    @Input() inputForm!: any;
    cancelClicked = output<any>();
    confirmClicked = output<any>();


  cancel() {
    this.cancelClicked.emit(true);
  }

  // for radio button
  walletSelected: boolean = false;
  otherSelected: boolean = false;
  selectWallet() {
    this.otherSelected = false;
    this.walletSelected = true;
  }

  selectOther() {
    this.otherSelected = true;
    this.walletSelected = false;
  }

  checkout() {
    if (this.walletSelected) {
      this.confirmClicked.emit("wallet");
    } else if(this.otherSelected) {
      this.confirmClicked.emit("other");
    }
  }

}
