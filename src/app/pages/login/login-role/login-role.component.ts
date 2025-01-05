import { Component } from '@angular/core';
import { RoleCardComponent } from "../../signup/role-card/role-card.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-role',
  standalone: true,
  imports: [RoleCardComponent, CommonModule],
  templateUrl: './login-role.component.html',
  styleUrl: './login-role.component.css'
})
export class LoginRoleComponent {
  constructor(private router: Router) {}

    selectedOption: string | null = null;

    example: any;

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
