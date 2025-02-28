import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {

  constructor(
    private userService: UserService
  ) {}

  signUp() {
      this.userService.loginInfluencer();
  }

}
