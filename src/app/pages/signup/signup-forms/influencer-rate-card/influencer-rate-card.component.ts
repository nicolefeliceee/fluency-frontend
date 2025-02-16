import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { SignupInfluencer } from '../../../../models/signup-influencer';
import { PriceFormattingDirective } from '../../../../components/price-formatting.directive';
import { ConfirmationPopupComponent } from "../../../../components/confirmation-popup/confirmation-popup.component";

@Component({
  selector: 'app-influencer-rate-card',
  standalone: true,
  imports: [CommonModule, PriceFormattingDirective, FormsModule, ConfirmationPopupComponent],
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

  displayConfirmation: boolean = false;

  askConfirm() {
    console.log("askconfirm")
    this.displayConfirmation = true;
  }

  confirmConfirm() {
    this.nextStep();
  }

  confirmCancel() {
    this.displayConfirmation = false;
  }


  nextStep() {
    console.log(this.newUser)

    this.newUser.reelsPrice = this.reelPrice??"";
    this.newUser.feedsPrice = this.feedPrice??"";
    this.newUser.storyPrice = this.storyPrice??"";

    this.userService.signUpInfluencer(this.newUser).subscribe(
      (data) => {
        console.log(data);
        localStorage.setItem('user_id', (data as any)['id']);
        localStorage.setItem('name', (data as any)['name']);
        this.router.navigate(['/influencer-home'], { state: { signupSuccess: true } });
      }
    )
  }

  prevStep() {
    this.router.navigate(['/signup/influencer/category'],  { state: { newUser: this.newUser, userType: "influencer" } });
   }
  skip() { }
}
