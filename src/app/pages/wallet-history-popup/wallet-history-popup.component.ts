import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-wallet-history-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wallet-history-popup.component.html',
  styleUrl: './wallet-history-popup.component.css'
})
export class WalletHistoryPopupComponent {
  constructor(
    private fb: FormBuilder
  ) {}

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

}
