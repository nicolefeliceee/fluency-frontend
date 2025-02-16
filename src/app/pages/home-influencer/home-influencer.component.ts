import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Router } from '@angular/router';
import { AlertSuccessComponent } from "../../components/alert-success/alert-success.component";

@Component({
  selector: 'app-home-influencer',
  standalone: true,
  imports: [HeaderComponent, AlertSuccessComponent],
  templateUrl: './home-influencer.component.html',
  styleUrl: './home-influencer.component.css'
})
export class HomeInfluencerComponent {

  constructor(
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.signupSuccess = navigation?.extras.state?.['signupSuccess'];
  }

  signupSuccess: boolean = false;

}
