import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupBrand } from '../../../../models/signup-brand';
import { LocationService } from '../../../../services/location.service';
import { GenderService } from '../../../../services/gender.service';
import { AgeService } from '../../../../services/age.service';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from "../choose-category/category-card/category-card.component";
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-brand-target-market',
  standalone: true,
  imports: [FormsModule, CommonModule, CategoryCardComponent, ReactiveFormsModule],
  templateUrl: './brand-target-market.component.html',
  styleUrl: './brand-target-market.component.css'
})
export class BrandTargetMarketComponent implements OnInit {

  newUser: SignupBrand;
  targetForm!: FormGroup;
    submitted = false;

  targetLocation: [] = [];
  targetAge: [] = [];
  targetGender: [] = [];

  constructor(
    private router: Router,
    private locationService: LocationService,
    private genderService: GenderService,
    private ageService: AgeService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.newUser = navigation?.extras.state?.['newUser'];
  }

  locationOptions!: any[];
  ageOptions!: any[];
  genderOptions!: any[];

  ngOnInit(): void {
    this.locationService.getAllLocations().subscribe(
      (data) => {
        this.locationOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.ageService.getAllAgeRange().subscribe(
      (data) => {
        this.ageOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.genderService.getAllGender().subscribe(
      (data) => {
        this.genderOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.targetForm = this.fb.group({
          targetLocation: ['', Validators.required],
          targetAge: ['', [Validators.required]],
          targetGender: ['', [Validators.required]],
        });
  }

  selectedGender: any[] = [];

  isSelected(categoryId: number) {

    // influencer
    if (this.selectedGender.length > 2) {
      return false;
    }

    if (this.selectedGender.includes(categoryId)) {
      return true;
    } else {
      return false;
    }
  }

  selectGender(categoryId: number) {
    // toggle
    if (this.selectedGender.includes(categoryId)) {
      this.selectedGender.splice(this.selectedGender.indexOf(categoryId), 1);
    } else {
      this.selectedGender?.push(categoryId);
    }
  }


  onSubmit() {
    this.newUser.targetLocation = (this.targetForm.get('targetLocation')?.value);
    this.newUser.targetAgeRange = (this.targetForm.get('targetAge')?.value);
    this.newUser.targetGender = this.selectedGender;

    console.log(this.newUser);

    this.userService.signUpBrand(this.newUser).subscribe(
      (data) => {
        // redirect ke login
        this.router.navigate(['/login/brand'], {state: { status: "success"}});
      }
    )

  }

  prevStep(): void {
    if (this.newUser?.userType === 'brand') {
      this.router.navigate(['/signup/brand/category'],  { state: { newUser: this.newUser } });
    }
  }
}
