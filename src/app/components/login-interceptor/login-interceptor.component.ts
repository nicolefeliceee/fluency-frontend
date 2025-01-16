import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { SignupInfluencer } from '../../models/signup-influencer';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login-interceptor',
  standalone: true,
  imports: [],
  templateUrl: './login-interceptor.component.html',
  styleUrl: './login-interceptor.component.css'
})
export class LoginInterceptorComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) { }

  newInfluencer!: SignupInfluencer;


  async ngOnInit() {
    // get tokennya
    await this.userService.getToken();

    setTimeout(() => {
      console.log("keluar");
      console.log(localStorage.getItem('long_lived_token'));

      // kirim ke backend
    this.userService.sendToken(localStorage.getItem('long_lived_token') || '').subscribe(data => {
      console.log(data);

      this.newInfluencer = new SignupInfluencer(
        "","","","","","","",[],"","","",(data as any)['instagram_id']
      )

      // belum pernah signup
      if ((data as any)['id'] == '' || (data as any)['id'] == null) {
        console.log("new signup");
        localStorage.setItem('instagram_id', (data as any)['instagram_id']);

        this.router.navigate(['/signup/influencer/profile'], {state: {newUser: this.newInfluencer}});

      } else { //udh pernah signup
        localStorage.setItem('user_id', (data as any)['id']);
        localStorage.setItem('name', (data as any)['name']);
        localStorage.setItem('instagram_id', (data as any)['instagram_id']);

        this.router.navigate(['/home']);
      }


    },error=>{
      console.log(error)
      this.router.navigate(['/signup']);
    });

    }, 1000);




  }

}
