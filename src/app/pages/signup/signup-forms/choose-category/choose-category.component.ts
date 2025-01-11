import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../../services/category.service';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from "./category-card/category-card.component";
import { SignupBrand } from '../../../../models/signup-brand';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-category',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent],
  templateUrl: './choose-category.component.html',
  styleUrl: './choose-category.component.css'
})
export class ChooseCategoryComponent implements OnInit {

  newUser: SignupBrand;
  submitted = false;

  constructor(private router: Router, private categoryService: CategoryService) {
    const navigation = this.router.getCurrentNavigation();
    this.newUser = navigation?.extras.state?.['newUser'];
  }

  categories!: any[];

  selectedCategories: any[] = [];

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

  checkMaxLimit(categoryId: number) {
    // toggle
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories.splice(this.selectedCategories.indexOf(categoryId), 1);
    } else {
      // brand
      if (this.newUser?.userType === 'brand') {
        if (this.selectedCategories?.length >= 1) {
          console.log("max")
        } else {
          this.selectedCategories?.push(categoryId);
        }
      } else if (this.newUser?.userType === 'influencer'){
        if (this.selectedCategories?.length >= 5) {
          console.log("max")
        } else {
          this.selectedCategories?.push(categoryId);
        }
      }
    }

  }

  isSelected(categoryId: number) {

    // influencer
    if (this.selectedCategories.length > 5) {
      return false;
    }

    if (this.selectedCategories.includes(categoryId)) {
      return true;
    } else {
      return false;
    }
  }

  nextStep(): void {
    this.submitted = true;
    if (this.selectedCategories.length == 0) {
      return;
    }

    this.newUser.category = this.selectedCategories;

    if (this.newUser?.userType === 'brand') {
      this.router.navigate(['/signup/brand/target'],  { state: { newUser: this.newUser } });
    } else {
      this.router.navigate(['/signup/influencer/rate-card'],  { state: { newUser: this.newUser } });
    }
  }

  prevStep(): void {
    if (this.newUser?.userType === 'brand') {
      this.router.navigate(['/signup/brand/profile'],  { state: { newUser: this.newUser } });
    } else {
      this.router.navigate(['/signup/influencer/profile'],  { state: { newUser: this.newUser } });
    }
  }



}
