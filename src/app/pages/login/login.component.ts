import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { AlertErrorComponent } from "../../components/alert-error/alert-error.component";
import { AlertSuccessComponent } from "../../components/alert-success/alert-success.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, AlertErrorComponent, AlertSuccessComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  passwordVisible: boolean = false;
  email: string = '';
  password: string = '';
  signUpSuccess: boolean = false;
  loginError: boolean = false;

  constructor(private userService: UserService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.signUpSuccess = navigation?.extras.state?.['status'];
  }

  togglePassword():void{
    this.passwordVisible = !this.passwordVisible;
  }

  userLogin(){

    this.userService.loginUser(this.email, this.password).subscribe(
      (data: any) => {
        if (data['user_type'] == 'admin') {
          localStorage.setItem('user_type', data['user_type']);
          localStorage.setItem('name', data['name']);
          this.router.navigate(['/ticket']);
        } else {
          localStorage.setItem('user_id', data['id']);
          localStorage.setItem('name', data['name']);
          this.router.navigate(['/home']);
        }
      },error=>{
        this.loginError = true;
      });
  }

}
