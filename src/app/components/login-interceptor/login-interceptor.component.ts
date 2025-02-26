import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { SignupInfluencer } from '../../models/signup-influencer';
import { HeaderComponent } from '../header/header.component';
import { LoadingService } from '../../services/loading.service';
import { InstagramService } from '../../services/instagram.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login-interceptor',
  standalone: true,
  imports: [],
  templateUrl: './login-interceptor.component.html',
  styleUrl: './login-interceptor.component.css'
})
export class LoginInterceptorComponent implements OnInit {

  minimumFollowerCount: number = 1000;

  constructor(
    private router: Router,
    private userService: UserService,
    private loadingService: LoadingService,
    private instagramService: InstagramService
  ) { }

  newInfluencer!: SignupInfluencer;

  loadData() {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 3000);
  }


  async ngOnInit() {
    this.loadingService.show();

    // get tokennya
    await this.userService.getToken();

    setTimeout(() => {
      // kirim ke backend
      this.userService.sendToken(localStorage.getItem('long_lived_token') || '').subscribe(
        (data: any) => {
      console.log(data);

      this.newInfluencer = new SignupInfluencer(
        "","","","","","","",[],"","","",data['instagram_id'], localStorage.getItem('long_lived_token') || ''
      )

      // belum pernah signup
      if (data['id'] == '' || data['id'] == null) {
        // validasi jumlah follower
        this.instagramService.getProfile(localStorage.getItem('long_lived_token'), localStorage.getItem('instagram_id')).subscribe(
          (data) => {
            if (data['followers_count'] < this.minimumFollowerCount) {
              this.router.navigate(['/signup'], {state: {followerCountError: true}});
            } else {
              localStorage.setItem('instagram_id', data['instagram_id']);
              this.router.navigate(['/signup/influencer/profile'], {state: {newUser: this.newInfluencer}});
            }
          }
        )


      } else { //udh pernah signup
        localStorage.setItem('user_id', data['id']);
        localStorage.setItem('name', data['name']);
        localStorage.setItem('instagram_id', data['instagram_id']);

        this.router.navigate(['/influencer-home']);
      }


    },error=>{
          this.loadingService.hide();
      this.router.navigate(['/signup'], {state: {error: true}});
    });

    }, 1000);




  }

}
