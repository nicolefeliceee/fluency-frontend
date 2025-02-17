import { Component, OnInit } from '@angular/core';
import { CategoryCardComponent } from "../../signup/signup-forms/choose-category/category-card/category-card.component";
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderComponent } from "../../../components/header/header.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../../services/location.service';
import { GenderService } from '../../../services/gender.service';
import { AgeService } from '../../../services/age.service';
import { ConfirmationPopupComponent } from "../../../components/confirmation-popup/confirmation-popup.component";
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CategoryCardComponent, CommonModule, HeaderComponent, ReactiveFormsModule, ConfirmationPopupComponent],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit{

  imagePreview: any;
  imageBlob: any;
  imageFile: any;
  brand: any;
  profileForm!: FormGroup;
  submitted = false;

  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private genderService: GenderService,
    private ageService: AgeService,
    private categoryService: CategoryService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {

  }

  //  dropdown optiona
  locationOptions!: any[];
  ageOptions!: any[];
  genderOptions!: any[];
  categoryOptions!: any[];

  profilePictureByte: any;
  profilePictureName: any;

  ngOnInit(): void {
    this.locationService.getAllLocations().subscribe(
      (data) => {
        this.locationOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categoryOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.ageService.getAllAgeRange().subscribe(
      (data) => {
        this.ageOptions = data;
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

    this.userService.getProfile(localStorage.getItem('user_id') || '').subscribe(
      (data) => {
        console.log(data);
        this.brand = data;
        if (data['profile_picture_byte']) {
          this.imageBlob = this.dataURItoBlob(data['profile_picture_byte'], data['profile_picture_type']);
          this.imageFile = new File([this.imageBlob], data['profile_picture_name'], { type: data['profile_picture_type'] });
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.imageFile));
        }

        this.profileForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          location: ['', [Validators.required]],
          phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
          category: ['', [Validators.required]],
          targetLocation: ['', [Validators.required]],
          targetAgeRange: ['', [Validators.required]],
        });

        this.profileForm.setValue({
          name: this.brand.name,
          email:this.brand.email,
          location:this.brand['location_map']['id'],
          phone:this.brand.phone,
          category:this.brand['category_map']['id'],
          targetLocation: this.getIdFromArray(this.brand['target_location']),
          targetAgeRange:this.getIdFromArray(this.brand['target_age_range'])
        })

        this.selectedGender = this.getIdFromArray(this.brand['target_gender'])

        this.profilePictureByte = this.brand['profile_picture_byte'];
        this.profilePictureName = this.brand['profile_picture_name'];

        console.log(this.profileForm.value)
      },
      (error) => {
        console.log(error);
      }
    )
  }

  get profileFormControl() {
    return this.profileForm.controls;
  }

  public dataURItoBlob(picBytes: any, imageType: any) {
    const byteString = window.atob(picBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8array], { type: imageType });
    return blob;
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result; // Set the result to imagePreview
      };

      reader.readAsDataURL(file); // Convert image to base64 URL
      this.imageFile = file;
      this.profilePictureName = file.name;
    }
  }

  // for confirm popup
  displayConfirmation: boolean = false;
  confirmHeader: any;
  confirmBody: any;

  onSubmit() {
    // kosongin aja
  }

  emailExist: boolean = false;

  onSave() {
    // validasi
    this.submitted = true;
    this.userService.validateEmail(this.profileForm.get('email')?.value).subscribe(
      data => {
        if (data.length == 0) {
          if (this.profileForm.valid) {
            this.askConfirm(2);
          }
        } else { // if email exist, show error
          this.emailExist = true;
        }
      }
    )



  }

  cancelEdit() {
    this.router.navigate(['/profile-brand']);
  }

  saveEdit() {

      let formData = new FormData();

    formData.append('data', JSON.stringify({
      name: this.profileForm.get('name')?.value,
      email: this.profileForm.get('email')?.value,
      phone: this.profileForm.get('phone')?.value,
      location: this.profileForm.get('location')?.value,
      category: this.getArrayFromId(this.profileForm.get('category')?.value),
      targetAgeRange: this.profileForm.get('targetAgeRange')?.value,
      targetGender: this.selectedGender,
      targetLocation: this.profileForm.get('targetLocation')?.value,
    }));


    console.log(this.imagePreview);

    if (this.imagePreview) {
      formData.append('profile_picture', this.imageFile, this.imageFile.name); // Add the file
    } else {
      formData.append('profile_picture', new Blob, ''); // Add the file

    }

    this.userService.editProfileBrand(formData).subscribe(
      (data) => {
        this.router.navigate(['/profile-brand'], {state: {editSuccess: true}})
      },
      (error) => {
        console.log(error);
      }
    )
  }


  askConfirm(id: number) {
    if (id == 1) {
      this.displayConfirmation = true;
      this.confirmHeader = "Cancel edit";
      this.confirmBody = "Are you sure want to cancel edit?";
    } else if (id == 2) {
      this.displayConfirmation = true;
      this.confirmHeader = "Save edit";
      this.confirmBody = "Are you sure want to save edit?";
    }

  }

  confirmConfirm() {
    if (this.confirmHeader == 'Cancel edit') {
      this.displayConfirmation = false;
      this.cancelEdit();
    } else if (this.confirmHeader = 'Save edit') {
      this.displayConfirmation = false;
      this.saveEdit();
    }
  }

  getIdFromArray(array: any[]): any[] {
    let id: any[] = [];
    array.forEach(element => {
      id.push(element.id);
    });

    return id;
  }

  getArrayFromId(id: string) {
    let array = [];
    array.push(id);

    return array;
  }

  selectedGender: any[] = [];

  isSelected(genderId: number) {

    // influencer
    if (this.selectedGender.length > 2) {
      return false;
    }

    if (this.selectedGender.includes(genderId)) {
      return true;
    } else {
      return false;
    }
  }

  selectGender(genderId: number) {
    // toggle
    if (this.selectedGender.includes(genderId)) {
      this.selectedGender.splice(this.selectedGender.indexOf(genderId), 1);
    } else {
      this.selectedGender?.push(genderId);
    }
  }

}
