import { Component, OnInit } from '@angular/core';
import { RoleCardComponent } from "../../signup/role-card/role-card.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login-role',
  standalone: true,
  imports: [RoleCardComponent, CommonModule],
  templateUrl: './login-role.component.html',
  styleUrl: './login-role.component.css'
})
export class LoginRoleComponent{
  // userService: any;
  constructor(private router: Router, private userService: UserService) {}

    selectedOption: string | null = null;

    example: any;

    onOptionSelected(option: string) {
      this.selectedOption = option;
    }

    login() {
      if (this.selectedOption === "brand") {
        // redirect ke page login
        this.router.navigate(['/login/brand']);
      } else if(this.selectedOption === "influencer") {
        // redirect ke api instagram
        this.userService.loginInfluencer();
      }
    }
}
