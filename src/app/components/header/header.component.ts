import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { InstagramService } from '../../services/instagram.service';
import { UserService } from '../../services/user.service';
import { ConfirmationPopupComponent } from "../confirmation-popup/confirmation-popup.component";
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from 'node:fs/promises';
import { state } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule, ConfirmationPopupComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isDropdownVisible: boolean = false;

  toggleDropdown(event: MouseEvent): void {
    // Toggle dropdownnya
    event.stopPropagation();
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    // Close the dropdown if clicking outside
    this.isDropdownVisible = false;
  }

  constructor(
    private router: Router,
    private instagramService: InstagramService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {

  }

  isLogin: boolean = false;
  userId!: any;
  userName!: any;
  instagramId!: any;
  profilePicUrl: any;
  // profilePicBrand: string | ArrayBuffer | null = null;
  profilePicBrand: any;

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');
    this.instagramId = localStorage.getItem('instagram_id');
    this.userName = localStorage.getItem('name');
    // console.log(this.userId);
    if (this.userId) {
      this.isLogin = true;
    }



    if (this.instagramId) {
      this.instagramService.getProfile(localStorage.getItem("long_lived_token") || '', localStorage.getItem('instagram_id')).subscribe(
        (data: any) => {
          this.profilePicUrl = data['profile_picture_url'];
        },
        (error) => {
          console.log(error);
        }
      )
    } else {
      this.userService.getProfile(localStorage.getItem("user_id") || '').subscribe(
        (data: any) => {
          if (data['profile_picture_byte']) {
            const imageBlob = this.dataURItoBlob(data['profile_picture_byte'], data['profile_picture_type']);
            const imageFile = new File([imageBlob], data['profile_picture_name'], { type: data['profile_picture_type'] });
            this.profilePicBrand = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile));
          }
        },
        (error) => {
          console.log(error);
        }
      )
   }
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

  displayConfirm: boolean = false;
  confirmBody!: string;
  confirmHeader!: string;

  askConfirm(id: any) {
    if (id == '1') {
      this.confirmHeader = 'Logout Confirmation';
      this.confirmBody = 'Are you sure want to logout?'
      this.displayConfirm = true;
    }
  }

  confirmConfirm() {
    this.displayConfirm = false;
    this.logout();
  }

  confirmCancel() {
    this.displayConfirm = false;
  }

  logout(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    localStorage.removeItem('instagram_id');
    localStorage.removeItem('long_lived_token');
    this.isLogin = false;
    this.router.navigate(['/']);
  }

  viewProfile() {
    if (this.instagramId) {
      this.router.navigate(['/profile-influencer']);
    } else {
      this.router.navigate(['/profile-brand']);
    }
  }



}
