import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Router } from '@angular/router';
import { AlertSuccessComponent } from "../../components/alert-success/alert-success.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Category {
  id: number; // ID kategori
  label: string; // Nama kategori
}

interface InfluencerDetail {
  id: number;
  name: string;
  email: string;
  location: string;
  phone: string;
  gender: string;
  category: Category[];
  usertype: string;
  instagramid: string;
  isactive: boolean;
  token: string;
  followers: string;
  rating: number;
  totalreview: string;
  profilepicture: string;
  postmedia?: string;
  engagement?: number;
  following?: string;
  username?: string;
  bio?: string;
}

@Component({
  selector: 'app-home-influencer',
  standalone: true,
  imports: [HeaderComponent, AlertSuccessComponent, CommonModule],
  templateUrl: './home-influencer.component.html',
  styleUrl: './home-influencer.component.css'
})
export class HomeInfluencerComponent {
  influencer: InfluencerDetail | null = null; // Tipe array Influencer

  constructor(
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.signupSuccess = navigation?.extras.state?.['signupSuccess'];
    this.generateDaysInWeek();
  }

  signupSuccess: boolean = false;

  // isActive = false; // Default tidak aktif

  // toggleActive() {
  //   console.log('Status isActive:', this.isActive ? 'Active' : 'Inactive');
  // }



  currentDate = new Date();
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  displayedDate = new Date(); // Menyimpan tanggal yang ditampilkan
  displayedWeek: Date[] = []; // Menyimpan tanggal dalam minggu yang aktif
  selectedDate: Date = new Date(); // Menyimpan tanggal yang dipilih

  // Fungsi untuk mendapatkan minggu berdasarkan tanggal yang dipilih
  generateDaysInWeek() {
    const startOfWeek = this.getStartOfWeek(this.displayedDate);
    this.displayedWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }

  // Fungsi untuk mendapatkan awal minggu dari suatu tanggal
  getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Mulai dari hari Minggu
    return start;
  }

  // Fungsi untuk navigasi antar minggu
  changeWeek(step: number) {
    this.displayedDate.setDate(this.displayedDate.getDate() + step * 7);
    this.generateDaysInWeek();
  }

  // Fungsi untuk mengecek apakah tanggal adalah hari ini
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // Fungsi untuk mengecek apakah tanggal adalah yang dipilih
  isSelected(date: Date): boolean {
    return date.toDateString() === this.selectedDate.toDateString();
  }

  // Fungsi untuk memilih tanggal
  selectDate(date: Date) {
    this.selectedDate = new Date(date);
  }

}
