import { Component, Input, input, output, } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-card.component.html',
  styleUrl: './role-card.component.css'
})
export class RoleCardComponent {

  label = input.required<string>();
  description = input.required<string>();
  imgSrc = input.required<string>();

  // option = input.required<string>();
  // isSelected = input<boolean>(false);
  @Input() isSelected: boolean = false;
  @Input() option!: string;
  optionSelected = output<any>();

  selectOption() {
    this.optionSelected.emit(this.option);
  }
}
