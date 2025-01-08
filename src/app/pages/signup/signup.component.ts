import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { RoleCardComponent } from "./role-card/role-card.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { SignupUser } from '../../models/signup-user';
import { state } from '@angular/animations';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RoleCardComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private router: Router) {}

  selectedOption: string | null = null;

  example: any;

  onOptionSelected(option: string) {
    this.selectedOption = option;
  }

  newUser: SignupUser = new SignupUser(
    "",
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
      this.newUser.userType = "brand";
      // redirect ke page complete profile
      this.router.navigate(['/signup/brand/profile'], { state: { newUser: this.newUser } });
    } else if(this.selectedOption === "influencer") {
      // redirect ke api instagram
    }
  }

}
