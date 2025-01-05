import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../../services/category.service';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from "./category-card/category-card.component";

@Component({
  selector: 'app-choose-category',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent],
  templateUrl: './choose-category.component.html',
  styleUrl: './choose-category.component.css'
})
export class ChooseCategoryComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  categories!: any[];

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
