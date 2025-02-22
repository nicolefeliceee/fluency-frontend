import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { error } from 'console';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderComponent } from "../../../components/header/header.component";
import { CategoryCardComponent } from "../../signup/signup-forms/choose-category/category-card/category-card.component";
import { AlertSuccessComponent } from "../../../components/alert-success/alert-success.component";

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CategoryCardComponent, AlertSuccessComponent],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent implements OnInit{
  userId: any;
  imagePreview: any;
  brand: any;

  editSuccess: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    const navigation = this.router.getCurrentNavigation();
     this.editSuccess = navigation?.extras.state?.['editSuccess'];
     setTimeout(() => {
       this.editSuccess = false;
     }, 2000);
  }

  ngOnInit(): void {
    this.userService.getProfile(localStorage.getItem("user_id")||'').subscribe(
      (data) => {
        console.log(data);
        this.brand = data;
        if (data['profile_picture_byte']) {
          const imageBlob = this.dataURItoBlob(data['profile_picture_byte'], data['profile_picture_type']);
          const imageFile = new File([imageBlob], data['profile_picture_name'], { type: data['profile_picture_type'] });
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile));
        }
      },
      (error) => {
        console.log(error);
      }
    )
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


  openEdit() {
    this.router.navigate(['/profile-brand/edit']);
  }

}
