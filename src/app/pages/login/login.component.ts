import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  passwordVisible: boolean = false;
  email: string = '';
  password: string = '';
  signUpSuccess: boolean = false;

  constructor(private userService: UserService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.signUpSuccess = navigation?.extras.state?.['status'];
  }

  togglePassword():void{
    this.passwordVisible = !this.passwordVisible;
  }

  userLogin(){
    // console.log(this.email);
    // console.log(this.password);
    this.userService.loginUser(this.email, this.password).subscribe(
      (data) => {
        console.log(data);
        localStorage.setItem('user_id', (data as any)['id']);
        this.router.navigate(['/home']);
      },error=>{
        console.log(error)
      });
  }

}
