import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
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


}
