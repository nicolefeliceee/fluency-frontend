import { Component } from '@angular/core';
import { SignupInfluencer } from '../../../../models/signup-influencer';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocationService } from '../../../../services/location.service';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { GenderService } from '../../../../services/gender.service';
import { InstagramService } from '../../../../services/instagram.service';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  selector: 'app-complete-profile-influencer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './complete-profile-influencer.component.html',
  styleUrl: './complete-profile-influencer.component.css'
})
export class CompleteProfileInfluencerComponent {
  imagePreview: string | ArrayBuffer | null = null;
  username: string | null = null;

  newUser: SignupInfluencer;
  profileForm!: FormGroup;
  submitted = false;
  emailExist = false;

    constructor(
      private fb: FormBuilder,
      private router: Router,
      private locationService: LocationService,
      private genderService: GenderService,
      private userService: UserService,
      private instagramService: InstagramService,
      private loadingService: LoadingService
    ) {
      const navigation = this.router.getCurrentNavigation();
      this.newUser = navigation?.extras.state?.['newUser'];
      console.log(this.newUser);
    }

    passwordVisible: boolean = false;

    // location dropdown
    locationOptions!: any[];
    genderOptions!: any[];

    ngOnInit(): void {
      this.loadingService.hide();
      this.locationService.getAllLocations().subscribe(
        (data) => {
          this.locationOptions = data;
        },
        (error) => {
          console.log(error);
        }
      )

      this.genderService.getAllGender().subscribe(
        (data) => {
          this.genderOptions = data;
        },
        (error) => {
          console.log(error);
        }
      )

      this.profileForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        location: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        dob: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      });

      this.instagramService.getProfile(localStorage.getItem('long_lived_token'), localStorage.getItem('instagram_id')).subscribe(
        (data) => {
          this.imagePreview = (data as any)['profile_picture_url']
          this.username = (data as any)['username']
        }
      )

    }

    get profileFormControl() {
      return this.profileForm.controls;
    }


    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          this.imagePreview = reader.result; // Set the result to imagePreview
        };

        reader.readAsDataURL(file); // Convert image to base64 URL
      }
    }

     // Trigger the hidden file input
     triggerFileInput(): void {
      const fileInput = document.getElementById('fileInput') as HTMLElement;
      fileInput.click();
    }

    togglePassword():void{
      this.passwordVisible = !this.passwordVisible;
    }

    onSubmit() {
      this.submitted = true;
      this.emailExist = false;

      let email = this.profileForm.get('email')?.value;

      // jika email udh diisi, validasi email
      if (email !== "") {
        this.userService.validateEmail(email).subscribe(
          (data) => {
            // if email doesnt exist
            if (data.length == 0) {
              if (this.profileForm.valid) {
                this.newUser.name = this.profileForm.get('name')?.value;
                this.newUser.email = this.profileForm.get('email')?.value;
                this.newUser.phone = this.profileForm.get('phone')?.value;
                this.newUser.location = this.profileForm.get('location')?.value;
                this.newUser.dob = this.profileForm.get('dob')?.value;
                this.newUser.gender = this.profileForm.get('gender')?.value;
                this.nextStep();
              }
            } else { // if email exist, show error
              this.emailExist = true;
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }

    }

  nextStep(): void {

    console.log(this.newUser);
    this.router.navigate(['/signup/influencer/category'], { state: { newUser: this.newUser, userType: "influencer" } });

  }

  prevStep(): void {
    this.router.navigate(['/signup']);
  }
}
