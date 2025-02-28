import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Router, RouterLink } from '@angular/router';
import { AlertSuccessComponent } from "../../components/alert-success/alert-success.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InfluencerService } from '../../services/influencer.service';
import { Chart } from 'chart.js';
import { WalletHistoryPopupComponent } from "../wallet-history-popup/wallet-history-popup.component";
import { WalletTransferPopupComponent } from "../wallet-transfer-popup/wallet-transfer-popup.component";
import { AlertErrorComponent } from '../../components/alert-error/alert-error.component';
import { HomeService } from '../../services/home.service';
import { LoadingService } from '../../services/loading.service';
import { WalletTopupPopupComponent } from "../wallet-topup-popup/wallet-topup-popup.component";
import { ProjectService } from '../../services/project.service';
import { error } from 'console';
import { ProjectCardComponent } from "../project/project-card/project-card.component";

interface Category {
  id: number; // ID kategori
  label: string; // Nama kategori
}

interface Graph {
  labels: string[];
  data: string[];
}

interface InfluencerDetail {
  id: number;
  influencerid: number;
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
  totalrevenue: string;
  revenueacc: Graph;
  waitingproj: string;
  ongoingproj: string;
  completedproj: string;
  projectpct: Graph;
  approvalpct: Graph;
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

interface ProjectDetail {
  projectheaderid: number;
  projectdetailid: number;
  fulldate: Date;
  day: string;
  date: string;
  brandname: string;
  mediatype: string;
  projecttitle: string;
}

@Component({
  selector: 'app-home-influencer',
  standalone: true,
  imports: [HeaderComponent, AlertSuccessComponent, CommonModule, WalletHistoryPopupComponent, WalletTransferPopupComponent, AlertSuccessComponent, AlertErrorComponent, WalletTopupPopupComponent, RouterLink, ProjectCardComponent],
  templateUrl: './home-influencer.component.html',
  styleUrl: './home-influencer.component.css'
})
export class HomeInfluencerComponent implements OnInit{
  influencer: InfluencerDetail | null = null; // Tipe array Influencer
  projectDetails: ProjectDetail[] = []; // Tipe array Influencer
  projectList!: any[];
  // pastelColor: string;

  constructor(
    private router: Router,
    private influencerService: InfluencerService,
    private homeService: HomeService,
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.signupSuccess = navigation?.extras.state?.['signupSuccess'];
    this.generateDaysInWeek();
    // this.pastelColor = this.getRandomPastelColor();
  }

  influencerId: string | null = null;
  walletheader!: WalletHeader;
  showErrorTf: boolean = false;
  showSuccessTf: boolean = false;
  errorMessage: string = ''; // To store error message
  successMessage: string = '';

  ngOnInit(): void {
    // this.influencerId = localStorage.getItem("user_id");
    // this.influencerId = "3";
    // console.log('Influencer ID:', this.influencerId);
    this.loadingService.hide();

    this.influencerService.getHomeInfluencer().subscribe(
      (response) => {
        this.influencer = response;
        console.log('Detail influencer:', this.influencer);

        this.createChart();
        this.getProject(new Date());
      },
      (error) => {
        console.error('Error get detail influencer:', error);
      }
    );

    this.loadWalletInfo();

    this.projectService.getProjects('3', localStorage.getItem('user_id') || '', null).subscribe(
      (data) => {
        console.log(data);
        this.projectList = data;
      },
      (error) => {
        console.log(error);
      }
    )

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

  isWalletTopupPopupVisible: boolean = false;

  showWalletTopupPopup(): void {
    this.isWalletTopupPopupVisible = true;
  }

  closeWalletTopupPopup(): void {
    this.isWalletTopupPopupVisible = false;
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
    this.getProject(date);
  }

  getProject(date: Date){
    if (!this.influencer?.influencerid) {
      console.error("Influencer ID is not available.");
      return;
    }
    this.influencerService.getProject(this.influencer.influencerid, date).subscribe(
      (response: ProjectDetail[] | null) => {
        if (response) {
          this.projectDetails = response.sort((a, b) =>
            new Date(a.fulldate).getTime() - new Date(b.fulldate).getTime()
          );
          console.log("Project sorted by fulldate:", this.projectDetails);
        } else {
          console.warn("No project details received.");
          this.projectDetails = [];
        }
      },
      (error) => {
        console.error("Error saat get project:", error);
      }
    );
    // this.influencerService.getProject(this.influencer.influencerid, date).subscribe(
    //   (response) => {
    //     // console.log("project: " + response);
    //     this.projectDetails = response;
    //     console.log("project: ", JSON.stringify(response, null, 2));
    //   }, error => {
    //     console.error("Error saat get project:", error);
    //   });
  }

  categoryColors: { [key: string]: string } = {
    "Fashion": "bg-pastel-1",
    "F&B": "bg-pastel-11",
    "Beauty": "bg-pastel-3",
    "Entertainment": "bg-pastel-4",
    "Technology": "bg-pastel-5",
    "Health": "bg-pastel-6",
    "Sport": "bg-pastel-7",
    "Travel": "bg-pastel-8",
    "Otomotive": "bg-pastel-9",
    "Household": "bg-pastel-10",
    "Hobby": "bg-pastel-2",
    "Finance": "bg-pastel-12"
  };

  getCategoryColor(category: string): string {
    return this.categoryColors[category] || "bg-pastel-1"; // Default jika tidak ditemukan
  }

  categoryColorsDay: { [key: string]: string } = {
    "Mon": "bg-pastel-1",
    "Tue": "bg-pastel-11",
    "Wed": "bg-pastel-3",
    "Thu": "bg-pastel-4",
    "Fri": "bg-pastel-5",
    "Sat": "bg-pastel-6",
    "Sun": "bg-pastel-7",
  };

  getRandomColor(category: string): string {
    return this.categoryColorsDay[category] || "bg-pastel-1"; // Default jika tidak ditemukan
  }


  goToProjectDetail(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/project/detail'], { state: { projectId: id } });
    } else {
      console.warn("ID influencer tidak tersedia.");
    }
  }

  // getRandomPastelColor(): string {
  //   // const randomIndex = Math.floor(Math.random() * 12) + 1;
  //   // return `bg-pastel-${randomIndex}`;
  //   return `bg-pastel-1`;
  // }

  // getRandomPastelColor(): string {
  //   const randomIndex = Math.floor(Math.random() * 12) + 1;
  //   return `bg-pastel-${randomIndex}`;
  // }

  public projectPct: any;
  public approvalPct: any;
  public revenueAcc: any;
  showPlaceholderProjectPct: boolean = false;
  showPlaceholderApprovalPct: boolean = false;

  createChart(){
    this.createProjectPct();
    this.createApprovalPct();
    this.createRevenueAcc();
  }

  createRevenueAcc(){
    const isMobile = window.innerWidth <= 768;
    this.revenueAcc = new Chart("RevenueAcc", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.influencer?.revenueacc.labels,
	       datasets: [
          {
            label: "Revenue Accumulation",
            data: this.influencer?.revenueacc.data,
            backgroundColor: "#EE9293",
            pointBackgroundColor: "#EE9293", // Warna titik pada garis
            pointBorderColor: "#EE9293", // Warna border titik
            borderColor: "#EE9293", // Warna garis biru
          }
        ]
      },
      options: {
        // aspectRatio: 1.5,
        // aspectRatio: 1.3,
        aspectRatio: isMobile ? 1.7 : 1.3,
        plugins: {
          legend: {
            display: false
          },
          datalabels:{
            display: false
          }
        },
        scales: {
          y: {
            min: 0, // Set minimum value of y-axis to 0
            beginAtZero: true, // Ensures the y-axis starts from 0
          }
        }
      }
    });
  }

  createProjectPct(){
    const numericData = this.influencer?.projectpct.data.map(Number) || [];
    const total = numericData.reduce((acc, val) => acc + val, 0); // Hitung total, default 1 untuk mencegah error

    if (total === 0) {
      this.showPlaceholderProjectPct = true; // Variabel untuk menandakan tidak ada data
      return;
    }

    this.showPlaceholderProjectPct = false;
    this.projectPct = new Chart("ProjectPct", {
      type: 'doughnut', //this denotes the type of chart

      data: {// values on X-Axis
        labels: this.influencer?.projectpct.labels,
        datasets: [
          {
            label: "Project Percentage",
            data: this.influencer?.projectpct.data,
            backgroundColor: ["#F7ABC7", "#87E1E1", "#FDE781"], // Warna opsional
          }
        ]
      },
      options: {
        aspectRatio: 1.5,
        plugins: {
          datalabels: {
            formatter: (value) => {
              const percentage = Number(((value / total) * 100).toFixed(1));
              return percentage > 0 ? percentage + '%' : ''; // FIX
            },
            color: "#000",
          },
          legend: {
            display: true,
            position: "right",
          }
        },
        cutout: "60%",
      },
      plugins: [{
        id: "centerText",
        beforeDraw: (chart) => {
          const { width, height, ctx, chartArea } = chart;
          ctx.save();

          // Tentukan ukuran font agar proporsional dengan chart
          const fontSize = Math.min(width, height) / 8; // Ukuran font responsif
          const labelFontSize = fontSize / 2; // Ukuran font lebih kecil untuk "Total"
          const marginBottom = labelFontSize / 3; // Tambahkan margin bawah

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Hitung posisi tengah lebih akurat
          const textX = (chartArea.left + chartArea.right) / 2;
          const textY = (chartArea.top + chartArea.bottom) / 2;

          // Gambar teks "Total" di atas angka total
          ctx.font = `regular ${labelFontSize}px Poppins`;
          ctx.fillStyle = "#000"; // Warna teks "Total" sedikit lebih redup
          ctx.fillText("Total", textX, textY - fontSize / 2 - marginBottom); // Geser ke atas

          // Gambar angka total di tengah
          ctx.font = `bold ${fontSize}px Poppins`;
          ctx.fillStyle = "#000"; // Warna teks utama
          ctx.fillText(total.toString(), textX, textY + labelFontSize / 2); // Geser sedikit ke bawah

          ctx.restore();
        }
      }]
    });
  }

  createApprovalPct(){
    const numericData = this.influencer?.approvalpct.data.map(Number) || [];
    const total = numericData.reduce((acc, val) => acc + val, 0); // Hitung total, default 1 untuk mencegah error

    if (total === 0) {
      this.showPlaceholderApprovalPct = true; // Variabel untuk menandakan tidak ada data
      return;
    }

    this.showPlaceholderApprovalPct = false;
    this.approvalPct = new Chart("ApprovalPct", {
      type: 'doughnut', //this denotes the type of chart

      data: {// values on X-Axis
        labels: this.influencer?.approvalpct.labels,
        datasets: [
          {
            label: "Project Percentage",
            data: this.influencer?.approvalpct.data,
            backgroundColor: ["#F7ABC7", "#87E1E1", "#FDE781"], // Warna opsional
          }
        ]
      },
      options: {
        aspectRatio: 1.5,
        plugins: {
          datalabels: {
            formatter: (value) => {
              const percentage = Number(((value / total) * 100).toFixed(1));
              return percentage > 0 ? percentage + '%' : ''; // FIX
            },
            color: "#000",
          },
          legend: {
            display: true,
            position: "right",
          }
        },
        cutout: "60%",
      },
      plugins: [{
        id: "centerText",
        beforeDraw: (chart) => {
          const { width, height, ctx, chartArea } = chart;
          ctx.save();

          // Tentukan ukuran font agar proporsional dengan chart
          const fontSize = Math.min(width, height) / 8; // Ukuran font responsif
          const labelFontSize = fontSize / 2; // Ukuran font lebih kecil untuk "Total"
          const marginBottom = labelFontSize / 3; // Tambahkan margin bawah

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Hitung posisi tengah lebih akurat
          const textX = (chartArea.left + chartArea.right) / 2;
          const textY = (chartArea.top + chartArea.bottom) / 2;

          // Gambar teks "Total" di atas angka total
          ctx.font = `regular ${labelFontSize}px Poppins`;
          ctx.fillStyle = "#000"; // Warna teks "Total" sedikit lebih redup
          ctx.fillText("Total", textX, textY - fontSize / 2 - marginBottom); // Geser ke atas

          // Gambar angka total di tengah
          ctx.font = `bold ${fontSize}px Poppins`;
          ctx.fillStyle = "#000"; // Warna teks utama
          ctx.fillText(total.toString(), textX, textY + labelFontSize / 2); // Geser sedikit ke bawah

          ctx.restore();
        }
      }]
    });
  }

  setTO(){
    setTimeout(() => {
      this.booleanErrorActive = false;
      this.errorActive = "";
    }, 3000);
  }

  errorActive: string = "";
  booleanErrorActive: boolean = false;
  // untuk toggle aktif non aktif
  toggleActive(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (!this.influencer?.influencerid) {
      console.error("Influencer ID is not available.");
      this.booleanErrorActive = true;
      this.setTO();
      this.errorActive = "Failed to update status: Influencer ID not found.";
      return;
    }

    if (!checkbox.checked) {
      // Jika dinonaktifkan cek project ongoing
      this.influencerService.checkProject(this.influencer.influencerid)
      .subscribe((response: { projectCompleted: boolean }) => { // Menyesuaikan tipe respons
        console.log("project completion: " + response.projectCompleted);
        if (response.projectCompleted) {
          this.booleanErrorActive = false;
          this.updateStatus(false); // Jika profil lengkap, aktifkan status
        } else {
          this.booleanErrorActive = true;
          this.setTO();
          this.errorActive = "Account can't be deactivated while there is ongoing project.";

          checkbox.checked = true; // Batalkan perubahan jika profil belum lengkap
        }
      }, error => {
        console.error("Error checking ongoing project:", error);
        this.booleanErrorActive = true;
        this.setTO();
        this.errorActive = "An error occurred while checking ongoing project.";
        checkbox.checked = true; // Batalkan perubahan jika ada error
      });
      // Jika dinonaktifkan langsung update status
      // this.updateStatus(false);
      return;
    }

    this.influencerService.checkProfileCompletion(this.influencer.influencerid)
      .subscribe((response: { profileCompleted: boolean }) => { // Menyesuaikan tipe respons
        console.log("profile completion: " + response.profileCompleted);
        if (response.profileCompleted) {
          this.booleanErrorActive = false;
          this.errorActive = "";
          this.updateStatus(true); // Jika profil lengkap, aktifkan status
        } else {
          this.booleanErrorActive = true;
          this.setTO();
          this.errorActive = "Please complete your profile before activating your account.";
          checkbox.checked = false; // Batalkan perubahan jika profil belum lengkap
        }
      }, error => {
        console.error("Error checking profile:", error);
        this.booleanErrorActive = true;
        this.setTO();
        this.errorActive = "An error occurred while checking profile completion.";
        checkbox.checked = false; // Batalkan perubahan jika ada error
      });
  }

  updateStatus(status: boolean) {
    if (!this.influencer?.influencerid) {
      console.error("Influencer ID is not available.");
      this.booleanErrorActive = true;
      this.setTO();
      this.errorActive = "Failed to update status: Influencer ID not found.";
      return;
    }

    this.influencerService.updateInfluencerStatus(this.influencer.influencerid, status)
      .subscribe(() => {
        this.influencer!.isactive = status;
        this.booleanErrorActive = false;
        this.errorActive = "";
      }, error => {
        console.error("Error saat mengupdate status:", error);
        this.booleanErrorActive = true;
        this.setTO();
        this.errorActive = "Failed to update status.";
      });
  }


}
