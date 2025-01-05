import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-interceptor',
  standalone: true,
  imports: [],
  templateUrl: './login-interceptor.component.html',
  styleUrl: './login-interceptor.component.css'
})
export class LoginInterceptorComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}
  ngOnInit(){
    // get tokennya
    this.userService.getToken();

    // kirim ke backend
    this.userService.sendToken(localStorage.getItem('long_lived_token') || '').subscribe(data=>{
      console.log(data)
      this.router.navigate(['/home']);
    },error=>{
      console.log(error)
      this.router.navigate(['/signup/influencer/profile']);
    });


    // this.router.navigate(['/home']);
  }

}
