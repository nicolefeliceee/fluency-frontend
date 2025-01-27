import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface WalletDetailDto {
  wallet_detail_id: number;
  partner_id: number | null;
  partner_name: string | null;
  wallet_header_id: number;
  transaction_type_id: number;
  transaction_type_label: string;
  nominal: number;
  date_time: string;
  nominal_show: string;
}

interface WalletHeader {
  id: number;
  wallet_header_id: number;
  balance: number;
  balance_show: string;
  wallet_details_grouped: Record<string, WalletDetailDto[]>;
}

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

  @Input() walletHeader!: WalletHeader;
  objectKeys = Object.keys;

}
