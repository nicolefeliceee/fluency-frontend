import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { SignupInfluencer } from '../../../../models/signup-influencer';
import { PriceFormattingDirective } from '../../../../components/price-formatting.directive';

@Component({
  selector: 'app-influencer-rate-card',
  standalone: true,
  imports: [CommonModule, PriceFormattingDirective, FormsModule],
  templateUrl: './influencer-rate-card.component.html',
  styleUrl: './influencer-rate-card.component.css'
})
export class InfluencerRateCardComponent {

  newUser: SignupInfluencer;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.newUser = navigation?.extras.state?.['newUser'];
  }

  feedPrice!: string;
  reelPrice!: string;
  storyPrice!: string;


  nextStep() {

    this.newUser.reelsPrice = this.reelPrice;
    this.newUser.feedsPrice = this.feedPrice;
    this.newUser.storyPrice = this.storyPrice;

    console.log(this.newUser);

    this.userService.signUpInfluencer(this.newUser).subscribe(
      (data) => {
        console.log(data);
        this.router.navigate(['/home'])
      }
    )
  }

  prevStep() {
    this.router.navigate(['/signup/influencer/category'],  { state: { newUser: this.newUser, userType: "influencer" } });
   }
  skip() { }
}
