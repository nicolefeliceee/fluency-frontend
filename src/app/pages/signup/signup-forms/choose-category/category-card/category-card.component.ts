import { Component, Input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {

  @Input() label!: string;
  @Input() logo!: string;
  @Input() id!: number;

  @Input() isSelected: boolean = false;

  categorySelected = output<any>();

  selectCategory() {
    this.categorySelected.emit(this.id);
    // this.isSelected = !this.isSelected;
  }

}
