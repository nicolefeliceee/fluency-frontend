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
import { ConfirmationPopupComponent } from "../../../../components/confirmation-popup/confirmation-popup.component";

@Component({
  selector: 'app-brand-target-market',
  standalone: true,
  imports: [FormsModule, CommonModule, CategoryCardComponent, ReactiveFormsModule, ConfirmationPopupComponent],
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
    });

    this.targetForm.setValue({
      targetLocation: this.newUser.targetLocation,
      targetAge: this.newUser.targetAgeRange
    });

    this.selectedGender = this.newUser.targetGender
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

  signUpError: boolean = false;

  onSubmit() {
    this.newUser.targetLocation = (this.targetForm.get('targetLocation')?.value);
    this.newUser.targetAgeRange = (this.targetForm.get('targetAge')?.value);
    this.newUser.targetGender = this.selectedGender;

    console.log(this.newUser);

    let formData = new FormData();
    // formData.append('data', new Blob([JSON.stringify({
    //   name: this.newUser.name,
    //   email: this.newUser.email,
    //   password: this.newUser.password,
    //   userType: this.newUser.userType,
    //   location: this.newUser.location,
    //   targetAgeRange: this.newUser.targetAgeRange,
    //   targetGender: this.newUser.targetGender,
    //   targetLocation: this.newUser.targetLocation,
    //   phone: this.newUser.phone
    // })], { type: 'application/json' } ));

    console.log(formData);
    formData.append('data', JSON.stringify({
      userType: this.newUser.userType,
      name: this.newUser.name,
      email: this.newUser.email,
      phone: this.newUser.phone,
      location: this.newUser.location,
      category: this.newUser.category,
      password: this.newUser.password,
      targetAgeRange: this.newUser.targetAgeRange,
      targetGender: this.newUser.targetGender,
      targetLocation: this.newUser.targetLocation,
    }));
    console.log(formData.get('data'));

    formData.append('profile_picture', this.newUser.profilePicture, this.newUser.profilePictureName); // Add the file



    console.log(formData.get('profile_picture'));
    // console.log(formData.getAll('profile_picture'));
    this.userService.signUpBrand(formData).subscribe(
      (data) => {
        // redirect ke login
        this.router.navigate(['/login/brand'], {state: { status: "success"}});
      },
      (error) => {
        this.signUpError = true;
      }
    )

  }

  prevStep(): void {
    this.newUser.targetAgeRange = this.targetForm.get('targetAge')?.value;
    this.newUser.targetLocation = this.targetForm.get('targetLocation')?.value;
    this.newUser.targetGender = this.selectedGender;
    console.log(this.newUser);
    if (this.newUser?.userType === 'brand') {
      this.router.navigate(['/signup/brand/category'],  { state: { newUser: this.newUser, userType: "brand" } });
    }
  }

  confirmCancel() {
    this.displayConfirmation = false;
  }

  confirmConfirm() {
    this.onSubmit();
  }

  displayConfirmation: boolean = false;
  confirmHeader: any;
  confirmBody: any;

  askConfirm(id: any) {
    if (id == 1) {
      this.confirmHeader = "Sign up now";
      this.confirmBody = "Are you sure want to sign up now?"
      this.displayConfirmation = true;
    }
  }
}
