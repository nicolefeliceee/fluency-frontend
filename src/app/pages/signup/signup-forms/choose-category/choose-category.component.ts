import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../../services/category.service';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from "./category-card/category-card.component";
import { SignupBrand } from '../../../../models/signup-brand';
import { Router } from '@angular/router';
import { SignupInfluencer } from '../../../../models/signup-influencer';

@Component({
  selector: 'app-choose-category',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent],
  templateUrl: './choose-category.component.html',
  styleUrl: './choose-category.component.css'
})
export class ChooseCategoryComponent implements OnInit {

  newBrand: SignupBrand | null = null;
  newInfluencer: SignupInfluencer | null = null;
  userType: string;
  submitted = false;

  constructor(private router: Router, private categoryService: CategoryService) {
    const navigation = this.router.getCurrentNavigation();
    this.userType = navigation?.extras.state?.['userType'];

    if (this.userType === "brand") {
      this.newBrand = navigation?.extras.state?.['newUser'];
      this.selectedCategories = this.newBrand!.category;
    } else {
      this.newInfluencer = navigation?.extras.state?.['newUser'];
      this.selectedCategories = this.newInfluencer!.category;
    }
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
      if (this.userType === 'brand') {
        if (this.selectedCategories?.length >= 1) {
          console.log("max")
        } else {
          this.selectedCategories?.push(categoryId);
        }
      } else if (this.userType === 'influencer'){
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

    // this.newUser.category = this.selectedCategories;

    if (this.userType === 'brand') {
      if (this.newBrand) {
        this.newBrand.category = this.selectedCategories;
      }
      this.router.navigate(['/signup/brand/target'],  { state: { newUser: this.newBrand } });
    } else {
      if (this.newInfluencer) {
        this.newInfluencer.category = this.selectedCategories;
      }
      this.router.navigate(['/signup/influencer/rate-card'],  { state: { newUser: this.newInfluencer } });
    }
  }

  prevStep(): void {
    if (this.userType === 'brand') {
      if (this.newBrand) {
        this.newBrand.category = this.selectedCategories;
      }
      this.router.navigate(['/signup/brand/profile'],  { state: { newUser: this.newBrand } });
    } else {
      if (this.newInfluencer) {
        this.newInfluencer.category = this.selectedCategories;
      }
      this.router.navigate(['/signup/influencer/profile'],  { state: { newUser: this.newInfluencer } });
    }
  }



}
