import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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

  dismiss() {
    this.display = false;
  }
}
