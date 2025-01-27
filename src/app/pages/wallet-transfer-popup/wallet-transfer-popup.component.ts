import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';
// import 'preline';

@Component({
  selector: 'app-wallet-transfer-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wallet-transfer-popup.component.html',
  styleUrl: './wallet-transfer-popup.component.css'
})
export class WalletTransferPopupComponent {
  constructor(
    private fb: FormBuilder,
    private homeService: HomeService
  ) {}

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  isDropdownVisible: boolean = false;

  toggleDropdown(event: MouseEvent): void {
    // Toggle dropdownnya
    event.stopPropagation();
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    // Close the dropdown if clicking outside
    this.isDropdownVisible = false;
  }

  accNum!: number;
  amount!: number;
  submitted: boolean = false;

  selectedBank: string = 'novalue';
  showError: boolean = false;

  // Method to validate selection
  validateBankSelection() {
    console.log(this.selectedBank);
    if (this.selectedBank === 'novalue') {
      this.showError = true;
    } else {
      this.showError = false;
    }
    console.log("error: " + this.showError);
  }

  showErrorTf: boolean = false;
  showSuccessTf: boolean = false;
  errorMessage: string = ''; // To store error message
  successMessage: string = '';

  onTransfer(amount: number) {
    console.log('Amount:', amount);
    this.submitted = true;
    // Validasi jika input tidak memenuhi syarat
    if (this.selectedBank === 'novalue' || !this.accNum || this.amount < 1000 || !this.amount) {
      if(this.selectedBank === 'novalue'){
        this.showError = true;
      }
      return; // Stop the transfer process if validation fails
    }

    this.homeService.transfer(amount).subscribe(
      (response) => {
        this.showSuccessTf = true; // Show success message
        this.successMessage = 'Transfer completed successfully!';
        this.successAlert.emit(this.successMessage); // Emit success event
        this.transferCompleted.emit(); // Emit transfer completion
      },
      (error) => {
        console.error('Transfer failed:', error);
        // Akses pesan error yang dikirim oleh backend
        if (error.error) {
          // Menampilkan pesan error jika ada
          this.showErrorTf = true; // Show error message
          this.errorMessage = error.error; // Ambil pesan error
        } else {
          // Jika error tidak ada pesan spesifik, tampilkan pesan umum
          this.showErrorTf = true;
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.log(this.errorMessage);
        this.errorAlert.emit(this.errorMessage); // Emit error event
        this.transferCompleted.emit(); // Emit transfer completion
      }
    );

    this.transferCompleted.emit();
    // Proses nilai amount
  }

  @Output() transferCompleted = new EventEmitter<void>();
  @Output() successAlert = new EventEmitter<string>(); // Emit success message
  @Output() errorAlert = new EventEmitter<string>();   // Emit error message
}
