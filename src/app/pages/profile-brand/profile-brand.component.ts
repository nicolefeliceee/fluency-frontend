import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-brand',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile-brand.component.html',
  styleUrl: './profile-brand.component.css'
})
export class ProfileBrandComponent {
  
  isEditMode: boolean = false; // Track if in edit mode
  profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    category: 'Fashion',
    location: 'Jakarta'
  };

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    console.log('isEditMode:', this.isEditMode);

    // Save data when switching out of edit mode
    if (!this.isEditMode) {
      this.saveProfile();
    }
  }

  saveProfile() {
    // Logic to save the profile (e.g., API call)
    console.log('Profile saved:', this.profile);
  }
}
