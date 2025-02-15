import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-alert-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-success.component.html',
  styleUrl: './alert-success.component.css'
})
export class AlertSuccessComponent {
  @Input() label!: string;
  @Input() display!: boolean;

  dismissClicked = output<any>();

  dismiss() {
    this.dismissClicked.emit(null);
  }
}
