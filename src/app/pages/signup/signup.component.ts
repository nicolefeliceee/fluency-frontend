import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { RoleCardComponent } from "./role-card/role-card.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  onOptionSelected(option: string) {
    this.selectedOption = option;
  }

  signUp() {
    if (this.selectedOption === "brand") {
      // redirect ke page complete profile
      this.router.navigate(['/signup/brand/profile']);
    } else if(this.selectedOption === "influencer") {
      // redirect ke api instagram
    }
  }

}
