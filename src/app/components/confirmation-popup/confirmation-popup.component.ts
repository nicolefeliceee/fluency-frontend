import { CommonModule } from '@angular/common';
import { Component, Input, output, Output } from '@angular/core';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.css'
})
export class ConfirmationPopupComponent {

  @Input() display: boolean = false;

  @Input() header: string = 'Save to Draft';
  @Input() body!: string;

  cancelClicked = output<any>();
  confirmClicked = output<any>();

  cancel() {
    this.cancelClicked.emit(true);
  }

  confirm() {
    this.confirmClicked.emit(true);
  }

}
