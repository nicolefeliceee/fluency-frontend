import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-wallet-transfer-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wallet-transfer-popup.component.html',
  styleUrl: './wallet-transfer-popup.component.css'
})
export class WalletTransferPopupComponent {
  constructor(
    private fb: FormBuilder
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
}
