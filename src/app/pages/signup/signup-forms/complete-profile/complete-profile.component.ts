import { Component, OnInit, output, Output } from '@angular/core';
import { SignupBrand } from '../../../../models/signup-brand';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../../../services/location.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css'
})
export class CompleteProfileComponent implements OnInit{
  imagePreview: string | ArrayBuffer | null = null;
  newUser: SignupBrand;
  profileForm!: FormGroup;
  submitted = false;
  emailExist = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private locationService: LocationService,
    private userService: UserService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.newUser = navigation?.extras.state?.['newUser'];
  }

  passwordVisible: boolean = false;

  // location dropdown
  locationOptions!: any[];

  ngOnInit(): void {
    this.locationService.getAllLocations().subscribe(
      (data) => {
        this.locationOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      location: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    });
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
              this.newUser.password = this.profileForm.get('password')?.value;
              this.newUser.location = this.profileForm.get('location')?.value;
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

      if (this.newUser?.userType === 'brand') {
        this.router.navigate(['/signup/brand/category'], { state: { newUser: this.newUser } });
      } else {
        this.router.navigate(['/signup/influencer/category'],  { state: { newUser: this.newUser } });
      }


  }

  prevStep(): void {
    this.router.navigate(['/signup']);
  }

  async validateEmail(): Promise<boolean> {

    let email = this.profileForm.get('email')?.value;

    if (email === "") {
      return true;
    }

    await this.userService.validateEmail(email).subscribe(
      (data) => {
        console.log(data);
        if (data.length == 0) {
          console.log("masuk true");
          return true;
        } else {
          console.log("masuk false");
          return false;
        }
      },
      (error) => {
        console.log(error)
      }
    )
    console.log("keluar if");

    return false;
  }





}
