import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AdminComponent } from "../../../components/header/admin/admin.component";

interface User {
  id: number;
  influencerid?: number;
  brandid?: number;
  number: number;
  name: string;
  email: string;
  type: string;
  phone: string;
  status: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, AdminComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  users: User[] = [];
  filteredUsers: User[] = []; // Array untuk menampung hasil pencarian
  searchQuery: string = '';
  showDropdown: boolean = false;

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(){
    this.userService.getAllUser().subscribe(
      (response) => {
        this.users = response;
        this.filteredUsers = response;
        console.log('All user:', this.users);
      },
      (error) => {
        console.error('Error get all user:', error);
      }
    );
  }

  toggleBlock(user: any) {
    const newStatus = user.status === 'Blocked' ? 'Unblocked' : 'Blocked';

    this.userService.toggleBlock(user.id, newStatus).subscribe(
      (response) => {
        console.log("Update status success") // Update status di frontend setelah berhasil update di backend
        this.fetchUsers();
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }

  onSearch() {
    if (!this.searchQuery) {
      this.filteredUsers = this.users; // Jika input kosong, tampilkan semua user
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

}
