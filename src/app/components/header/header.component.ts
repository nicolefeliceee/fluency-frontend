import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { InstagramService } from '../../services/instagram.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet,RouterModule],
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
    private userService: UserService
  ) {

  }

  isLogin: boolean = false;
  userId!: any;
  userName!: any;
  instagramId!: any;
  profilePicUrl: any;

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
        (data) => {
          this.profilePicUrl = (data as any)['profile_picture_url'];
        },
        (error) => {
          console.log(error);
        }
      )
    } else {
      this.userService.getProfile(localStorage.getItem("user_id") || '').subscribe(
        (data) => {
          // console.log(data);
        },
        (error) => {
          console.log(error);
        }
      )
   }


  }


  logout(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    localStorage.removeItem('instagram_id');
    localStorage.removeItem('long_lived_token');
    this.isLogin = false;
    this.router.navigate(['/']);
  }



}
