import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { RoleCardComponent } from "./role-card/role-card.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { SignupBrand } from '../../models/signup-brand';
import { state } from '@angular/animations';
import { SignupInfluencer } from '../../models/signup-influencer';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RoleCardComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private router: Router, private userService: UserService) {}

  selectedOption: string | null = null;

  example: any;

  onOptionSelected(option: string) {
    this.selectedOption = option;
  }

  newBrand: SignupBrand = new SignupBrand(
    "brand",
    "",
    "",
    "",
    "",
    "",
    [],
    [],
    [],
    []
  );

  signUp() {
    if (this.selectedOption === "brand") {
      // redirect ke page complete profile
      this.router.navigate(['/signup/brand/profile'], { state: { newUser: this.newBrand } });
    } else if(this.selectedOption === "influencer") {
      // redirect ke api instagram
      this.userService.loginInfluencer();
    }
  }

}
