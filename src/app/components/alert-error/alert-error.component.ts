import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-alert-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-error.component.html',
  styleUrl: './alert-error.component.css'
})
export class AlertErrorComponent {

  @Input() label!: string;
  @Input() display!: boolean;

  dismissClicked = output<any>();

  dismiss() {
    this.dismissClicked.emit(null);
  }

}
