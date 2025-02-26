import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { MidtransService } from '../../services/midtrans.service';
// import 'preline';

@Component({
  selector: 'app-wallet-topup-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-topup-popup.component.html',
  styleUrl: './wallet-topup-popup.component.css'
})
export class WalletTopupPopupComponent {
constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private midtransService: MidtransService
  ) {}

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  amount!: number;
  submitted: boolean = false;
  showError: boolean = false;


  generateOrderReference(): string {
    const timestamp = Date.now();
    return `REF-${timestamp}`; // Example: REF-1673245678123
  }

  // topupSuccess = output<any>();
  @Output() topupCompleted = new EventEmitter<void>();
  topup(amount:number){
    console.log('Amount:', amount);
    this.submitted = true;
    // Validasi jika input tidak memenuhi syarat
    if (this.amount < 1000 || !this.amount) {
      this.showError = true;
      return; // Stop the transfer process if validation fails
    }

    let refNum = this.generateOrderReference();

    // get transaction token dulu from backend
    this.midtransService.getTransactionToken(refNum, amount).subscribe(
      async (data) => {
        if (window.snap) {
          try {
            await new Promise((resolve, reject) => {
              window.snap.pay(data, {
                onSuccess: (result: any) => {
                  console.log('Payment success:', result);
                  this.topupCompleted.emit();
                   // Panggil homeService untuk menambahkan saldo user
                  this.homeService.topup(amount).subscribe(
                    (response) => {
                      console.log('Saldo berhasil ditambahkan:', response);
                    },
                    (error) => {
                      console.error('Gagal menambahkan saldo:', error);
                    }
                  );
                  resolve(result);
                },
                onPending: (result: any) => {
                  console.log('Payment pending:', result);
                  resolve(result);
                },
                onError: (error: any) => {
                  console.error('Payment error:', error);
                  reject(error);
                },
                onClose: () => {
                  console.log('Payment popup closed.');
                  reject(new Error("User closed the payment popup"));
                }
              });
            });
          } catch (error) {
            console.error("Payment failed:", error);
          }
        }
      },
      (error) => {
        console.error("Failed to get transaction token:", error);
      }
    );
  }

}
