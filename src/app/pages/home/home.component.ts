import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ProjectCardComponent } from "../project/project-card/project-card.component";
import { InfluencerCardComponent } from "../../components/influencer-card/influencer-card.component";
import { HomeService } from '../../services/home.service';
import { CommonModule } from '@angular/common';
import { WalletHistoryPopupComponent } from "../wallet-history-popup/wallet-history-popup.component";
import { WalletTransferPopupComponent } from "../wallet-transfer-popup/wallet-transfer-popup.component";
import { LoadingService } from '../../services/loading.service';
import { AlertSuccessComponent } from "../../components/alert-success/alert-success.component";
import { AlertErrorComponent } from "../../components/alert-error/alert-error.component";
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { MidtransService } from '../../services/midtrans.service';
import { WalletTopupPopupComponent } from "../wallet-topup-popup/wallet-topup-popup.component";

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

interface WalletDetailDto {
  wallet_detail_id: number;
  partner_id: number | null;
  partner_name: string | null;
  wallet_header_id: number;
  transaction_type_id: number;
  transaction_type_label: string;
  nominal: number;
  date_time: string;
  nominal_show: string;
}

interface WalletHeader {
  id: number;
  wallet_header_id: number;
  balance: number;
  balance_show: string;
  wallet_details_grouped: Record<string, WalletDetailDto[]>;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, ProjectCardComponent, InfluencerCardComponent, CommonModule, WalletHistoryPopupComponent, WalletTransferPopupComponent, AlertSuccessComponent, AlertErrorComponent, WalletTopupPopupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(
    private homeService: HomeService,
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private projectService: ProjectService,
    private midtransService: MidtransService
  ) {}

  influencer: Influencer[] = []; // Tipe array Influencer
  recommendedinfluencer: Influencer[] = []; // Tipe array Influencer
  walletheader!: WalletHeader;
  showErrorTf: boolean = false;
  showSuccessTf: boolean = false;
  errorMessage: string = ''; // To store error message
  successMessage: string = '';

  // for projects
  projectList: any[] = [];
  userId: any = localStorage.getItem('user_id');

  ngOnInit(): void {
    this.loadingService.hide();
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

    this.projectService.getProjects('2', this.userId, null).subscribe(
      (data) => {
        console.log(data);
        this.projectList = this.projectList.concat(data);
        if (this.projectList.length < 3) {
          this.projectService.getProjects('1', this.userId, null).subscribe(
            (data2) => {
              this.projectList =  this.projectList.concat(data2);
            },
            (error) => {
              console.log(error);
            }
          )
        }
      },
      (error) => {
        console.log(error);
      }
    )

    this.loadWalletInfo();
  }

  loadWalletInfo(){
    this.homeService.getWalletInfo().subscribe(
      (response) => {
        this.walletheader = response;
        console.log('wallet info:', this.walletheader);
        // Mengurutkan wallet_details_grouped berdasarkan tanggal
        this.sortWalletDetailsByDate();
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error sending sort option:', error);
      }
    );
  }

  sortWalletDetailsByDate() {
    // Ambil wallet_details_grouped dan ubah menjadi array untuk pengurutan
    const walletDetailsGroupedArray = Object.entries(this.walletheader.wallet_details_grouped);

    // Urutkan berdasarkan tanggal (key)
    walletDetailsGroupedArray.sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateB.getTime() - dateA.getTime(); // Urutkan dari terbaru ke terlama
    });

    // Setelah mengurutkan, kembalikan ke format objek dengan Object.fromEntries
    this.walletheader.wallet_details_grouped = Object.fromEntries(walletDetailsGroupedArray);
  }

  // Tangani event dari wallet transfer
  onTransferCompleted(): void {
    console.log("ini on transfer completednya jalan");
    // Tambahkan delay sebelum memuat ulang wallet info
    setTimeout(() => {
      this.isWalletTransferPopupVisible = false;
      this.loadWalletInfo();
    }, 1000); // 1 detik delay
    // this.loadWalletInfo();
  }

  // Tangani event dari wallet transfer
  onTopupCompleted(): void {
    console.log("ini topup completednya jalan");
    // Tambahkan delay sebelum memuat ulang wallet info
    setTimeout(() => {
      this.isWalletTopupPopupVisible = false;
      this.loadWalletInfo();
    }, 100);
    // this.loadWalletInfo();
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

  isWalletTopupPopupVisible: boolean = false;

  showWalletTopupPopup(): void {
    this.isWalletTopupPopupVisible = true;
  }

  closeWalletTopupPopup(): void {
    this.isWalletTopupPopupVisible = false;
  }

  isWalletTransferPopupVisible: boolean = false;

  showWalletTransferPopup(): void {
    this.isWalletTransferPopupVisible = true;
  }

  closeWalletTransferPopup(): void {
    this.isWalletTransferPopupVisible = false;
  }

  // Tangkap notifikasi sukses
  showSuccessAlert(message: string): void {
    this.successMessage = message;

    // Hapus notifikasi setelah beberapa detik (opsional)
    setTimeout(() => {
      this.successMessage = '';
    }, 5000); // 5 detik
  }

  // Tangkap notifikasi error
  showErrorAlert(message: string): void {
    this.errorMessage = message;

    // Hapus notifikasi setelah beberapa detik (opsional)
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000); // 5 detik
  }

  // selectedId: number | null = null;  // Menyimpan ID kategori yang dipilih

  // Untuk redirect category
  redirectToInfluencer(categoryId: number): void {
    // this.selectedId = categoryId; // Menyimpan kategori yang dipilih
    this.router.navigate(['/influencer'], { queryParams: { categoryId } });
  }

}
