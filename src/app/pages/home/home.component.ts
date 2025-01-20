import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ProjectCardComponent } from "../project/project-card/project-card.component";
import { InfluencerCardComponent } from "../../components/influencer-card/influencer-card.component";
import { HomeService } from '../../services/home.service';
import { CommonModule } from '@angular/common';
import { WalletHistoryPopupComponent } from "../wallet-history-popup/wallet-history-popup.component";
import { WalletTransferPopupComponent } from "../wallet-transfer-popup/wallet-transfer-popup.component";

interface Category {
  id: number; // ID kategori
  label: string; // Nama kategori
}

interface Influencer {
  id: number; // ID dari user (integer)
  name: string; // Nama user
  email: string; // Email user
  location: string; // Label lokasi
  phone: string; // Nomor telepon
  gender: string; // Gender label
  dob: string; // Tanggal lahir (string, dalam format ISO/Date)
  feedsprice: string; // Harga feed
  reelsprice: string; // Harga reels
  storyprice: string; // Harga story
  category: Category[];
  usertype: string; // Tipe user
  instagramid: string; // ID Instagram
  isactive: boolean; // Status aktif
  token: string; // Token
  followers: string;
  rating: number;
  totalreview: string;
  minprice: string;
  profilepicture: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, ProjectCardComponent, InfluencerCardComponent, CommonModule, WalletHistoryPopupComponent, WalletTransferPopupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(
      private homeService: HomeService
  ) {}

  influencer: Influencer[] = []; // Tipe array Influencer
  recommendedinfluencer: Influencer[] = []; // Tipe array Influencer

  ngOnInit(): void {
    this.homeService.getRecommendation().subscribe(
      (response) => {
        this.recommendedinfluencer = response;
        console.log('recommendation:', response);
      },
      (error) => {
        console.error('Error sending sort option:', error);
      }
    );
    this.homeService.getTopInfluencer().subscribe(
      (response) => {
        this.influencer = response;
        console.log('top influencer:', response);
      },
      (error) => {
        console.error('Error sending sort option:', error);
      }
    );
  }

  getProfilePictureUrl(profilePicture: string): string {
    return profilePicture.replace(/\\"/g, ''); // Menghapus karakter escape
  }

  isWalletHistoryPopupVisible: boolean = false;

  showWalletHistoryPopup(): void {
    this.isWalletHistoryPopupVisible = true;
  }

  closeWalletHistoryPopup(): void {
    this.isWalletHistoryPopupVisible = false;
  }

  isWalletTransferPopupVisible: boolean = false;

  showWalletTransferPopup(): void {
    this.isWalletTransferPopupVisible = true;
  }

  closeWalletTransferPopup(): void {
    this.isWalletTransferPopupVisible = false;
  }

}
