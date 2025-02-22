import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { InstagramService } from '../../../services/instagram.service';
import { InfluencerService } from '../../../services/influencer.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../components/header/header.component";
import { ConfirmationPopupComponent } from "../../../components/confirmation-popup/confirmation-popup.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenderService } from '../../../services/gender.service';
import { LocationService } from '../../../services/location.service';
import { CategoryService } from '../../../services/category.service';


interface Category {
  id: number; // ID kategori
  label: string; // Nama kategori
}

interface TotalRating {
  rating: number;
  totalreview: number;
  percentage: number;
}

interface SimilarInfluencer {
  id: number;
  influencerId: number;
  username: string;
  category: Category[];
  profilepicture: string;
  finalscore: number;
}

interface Review {
  profilepicturebyte: Uint8Array;
  profilepicturetype: string;
  profilepicturename: string;
  name: string;
  date: string;
  rating: number;
  review: string;
}

interface Graph {
  labels: string[];
  data: string[];
}

interface MediaDetail {
  id: string;
  likecount: number;
  commentcount: number;
  sharecount: number;
  savecount: number;
  mediatype: string;
  mediaproducttype: string;
  mediaurl: string;
  permalink: string;
  timestamp: string;
  engagement: string;
  thumbnailurl: string;
}

interface StoryDetail {
  id: string;
  sharecount: number;
  viewcount: number;
  mediatype: string;
  mediaproducttype: string;
  mediaurl: string;
  permalink: string;
  timestamp: string;
  thumbnailurl: string;
}

interface InfluencerDetail {
  id: number;
  name: string;
  email: string;
  location: string;
  phone: string;
  gender: string;
  dob: string;
  feedsprice: string;
  reelsprice: string;
  storyprice: string;
  category: Category[];
  usertype: string;
  instagramid: string;
  isactive: boolean;
  token: string;
  followers: string;
  rating: number;
  totalreview: string;
  minprice: string;
  profilepicture: string;
  issaved?: boolean;
  postmedia?: string;
  engagement?: number;
  following?: string;
  username?: string;
  bio?: string;
  avglike?: string;
  avgcomment?: string;
  avgsaved?: string;
  avgshare?: string;
  totalrating?: TotalRating[];
  similarinfluencer?: SimilarInfluencer[];
  positiveanalytics?: any[];
  negativeanalytics?: any[];
  neutralanalytics?: any[];
  totalanalyticspost?: number;
  feedback?: Review[];
  follgrowth: Graph;
  reach: Graph;
  genderaud: Graph;
  onlinefollaud: Graph;
  highestonlinetime?: string;
  lowestonlinetime?: string;
  topcitiesaud: Graph;
  agerangeaud: Graph;
  media?: MediaDetail[];
  feeds?: MediaDetail[];
  reels?: MediaDetail[];
  story?: StoryDetail[];
}


@Component({
  selector: 'app-profile-inf-edit',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ConfirmationPopupComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './profile-inf-edit.component.html',
  styleUrl: './profile-inf-edit.component.css'
})
export class ProfileInfEditComponent implements OnInit{

  influencer: any;
    influencerId!: string;
    imagePreview: string | ArrayBuffer | null = null;
    username: string | null = null;
    profileForm!: FormGroup;

     constructor(
        private userService: UserService,
        private instagramService: InstagramService,
        private influencerService: InfluencerService,
        private genderService: GenderService,
        private locationService: LocationService,
        private categoryService: CategoryService,
        private router: Router,
       private sanitizer: DomSanitizer,
        private fb: FormBuilder
      ) {
    }

  stories: StoryDetail[] = [];

  //  dropdown optiona
  locationOptions!: any[];
  ageOptions!: any[];
  genderOptions!: any[];
  categoryOptions!: any[];

  maxDate!: string;

  ngOnInit(): void {
    let today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    this.locationService.getAllLocations().subscribe(
      (data) => {
        this.locationOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categoryOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.genderService.getAllGender().subscribe(
      (data) => {
        this.genderOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

      // pake useservice buat get data yg mau editable supaya lebih cepat
      this.userService.getProfile(localStorage.getItem("user_id")||'').subscribe(
        (data) => {
          this.influencer = data;

          // buat form dat ayg editable
          this.profileForm = this.fb.group({
            name: ['', Validators.required],
            gender: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
            dob: ['', [Validators.required]],
            location: ['', [Validators.required]],
            category: ['', [Validators.required]],
            storyPrice: ['', [Validators.required, Validators.min(1)]],
            feedsPrice: ['', [Validators.required, Validators.min(1)]],
            reelsPrice: ['', [Validators.required, Validators.min(1)]]
          });

          this.profileForm.setValue({
            name: this.influencer['name'],
            gender: this.influencer['gender_map']['id'],
            email:this.influencer['email'],
            phone:this.influencer['phone'],
            dob:this.influencer['dob'],
            location:this.influencer['location_map']['id'],
            category:this.getIdFromArray(this.influencer['category']),
            storyPrice:this.influencer['story_price'],
            feedsPrice:this.influencer['feeds_price'],
            reelsPrice:this.influencer['reels_price']
          })

          if (this.profileForm.get("storyPrice")?.value > 0) {
            this.storyActive = true;
          }

          if (this.profileForm.get("feedsPrice")?.value > 0) {
            this.feedsActive = true;
          }

          if (this.profileForm.get("reelsPrice")?.value > 0) {
            this.reelsActive = true;
          }

          this.storyCheckBoxToggle();
          this.feedsCheckBoxToggle();
          this.reelsCheckBoxToggle();

          // buat profilepic n username
          this.instagramService.getProfile(localStorage.getItem("long_lived_token") || '', localStorage.getItem('instagram_id')).subscribe(
            (data: any) => {
              this.imagePreview = data['profile_picture_url'];
              this.username = data['username'];
            },
            (error) => {
              console.log(error);
            }
          );

          // buat accounts analytics kebawah

          this.influencerId = this.influencer['influencer_id']

          this.influencerService.getDetailInfluencer(this.influencerId).subscribe(
            (response) => {
              this.influencer = response;
              this.stories = this.influencer?.story || [];

              this.createChart();
            },
            (error) => {
              console.error('Error get detail influencer:', error);
            }
          );
        },
        (error) => {
          console.log(error);
        }
    )

  }

  maxCategoryLimitExceed: boolean = false;

  checkCategoryCount() {
    if (this.profileForm.get("category")?.value.length > 5) {
      this.maxCategoryLimitExceed = true;
    } else {
      this.maxCategoryLimitExceed = false;
    }
  }

  getIdFromArray(array: any[]): any[] {
    let id: any[] = [];
    array.forEach(element => {
      id.push(element.id);
    });

    return id;
  }

    createChart(){
      this.createFollGrowth();
      this.createReach();
      this.createGenderAudience();
      this.createOnlineFollAudience();
      this.createTopCitiesAudience();
      this.createAgeRangeAudience();
    }

    public follGrowth: any;
    public reach: any;
    public genderAudience: any;
    public onlineFollAudience: any;
    public topCitiesAudience: any;
    public topCitiesLeft: any;
    public topCitiesRight: any;
    public ageRangeAudience: any;

      createFollGrowth(){
        this.follGrowth = new Chart("FollGrowth", {
          type: 'line', //this denotes tha type of chart

          data: {// values on X-Axis
            labels: this.influencer?.follgrowth.labels,
             datasets: [
              {
                label: "Followers Growth",
                data: this.influencer?.follgrowth.data,
                backgroundColor: "#EE9293",
                pointBackgroundColor: "#EE9293", // Warna titik pada garis
                pointBorderColor: "#EE9293", // Warna border titik
                borderColor: "#EE9293", // Warna garis biru
              }
            ]
          },
          options: {
            // aspectRatio: 1.5,
            aspectRatio: 2.5,
            plugins: {
              legend: {
                display: false
              },
              datalabels:{
                display: false
              }
            }
          }
        });
      }

      createReach(){
        this.follGrowth = new Chart("Reach", {
          type: 'line', //this denotes tha type of chart

          data: {// values on X-Axis
            labels: this.influencer?.reach.labels,
             datasets: [
              {
                label: "Reach",
                data: this.influencer?.reach.data,
                backgroundColor: "#B494C5",
                pointBackgroundColor: "#B494C5", // Warna titik pada garis
                pointBorderColor: "#B494C5", // Warna border titik
                borderColor: "#B494C5", // Warna garis biru
              }
            ]
          },
          options: {
            // aspectRatio: 1.5,
            aspectRatio: 2.5,
            plugins: {
              legend: {
                display: false
              },
              datalabels:{
                display: false
              }
            }
          }
        });
      }

      createGenderAudience(){
        const numericData = this.influencer?.genderaud.data.map(Number) || [];
        const total = numericData.reduce((acc: any, val: any) => acc + val, 0) || 1; // Hitung total, default 1 untuk mencegah error

        // Ubah label gender
        const genderLabels = this.influencer?.genderaud.labels.map((label: string) => {
            if (label === "F") return "Female";
            if (label === "M") return "Male";
            if (label === "U") return "Unknown";
            return label;
        }) || [];

        this.genderAudience = new Chart("GenderAudience", {
          type: 'doughnut', //this denotes the type of chart

          data: {// values on X-Axis
            labels: genderLabels,
            datasets: [
              {
                label: "Gender Audience",
                data: this.influencer?.genderaud.data,
                backgroundColor: ["#F7ABC7", "#87E1E1", "#FDE781"], // Warna opsional
              }
            ]
          },
          options: {
            aspectRatio: 1.5,
            plugins: {
              datalabels: {
                formatter: (value) => {
                  return ((value/total)*100).toFixed(1) + '%';
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


      createOnlineFollAudience(){
        this.onlineFollAudience = new Chart("OnlineFollowers", {
          type: 'bar', //this denotes tha type of chart

          data: {// values on X-Axis
            labels: this.influencer?.onlinefollaud.labels,
             datasets: [
              {
                label: "Online Followers",
                data: this.influencer?.onlinefollaud.data,
                backgroundColor: "#FFD5A5",
              }
            ]
          },
          options: {
            // aspectRatio: 1.5,
            aspectRatio: 2.5,
            plugins: {
              legend: {
                display: false
              },
              datalabels:{
                display: false
              }
            }
          }
        });
      }
      createTopCitiesAudience() {
        const labels = this.influencer?.topcitiesaud.labels || [];
        const data = this.influencer?.topcitiesaud.data?.map((value: any) => Number(value) || 0) || []; // Konversi ke angka

        // Ambil 5 data pertama untuk chart kiri, 5 data berikutnya untuk chart kanan
        const labelsLeft = labels.slice(0, 5);
        const dataLeft = data.slice(0, 5);
        const labelsRight = labels.slice(5, 10);
        const dataRight = data.slice(5, 10);

        // Dapatkan nilai maksimum dari kedua dataset agar skala seragam
        const maxValue = Math.max(...dataLeft, ...dataRight);

        // Chart untuk Top 5 Kota (Kiri)
        this.topCitiesLeft = new Chart("TopCitiesLeft", {
          type: "bar",
          data: {
            labels: labelsLeft,
            datasets: [{
              label: "Top Cities",
              data: dataLeft,
              backgroundColor: "#EEC9E8",
            }]
          },
          options: {
            indexAxis: "y",
            aspectRatio: 1.6,
            plugins: {
              legend: { display: false },
              datalabels:{
                display: false
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                suggestedMax: maxValue // Menyamakan skala dengan chart kanan
              }
            }
          }
        });

        // Chart untuk 5 Kota Berikutnya (Kanan)
        this.topCitiesRight = new Chart("TopCitiesRight", {
          type: "bar",
          data: {
            labels: labelsRight,
            datasets: [{
              label: "Top Cities",
              data: dataRight,
              backgroundColor: "#EEC9E8",
            }]
          },
          options: {
            indexAxis: "y",
            aspectRatio: 1.6,
            plugins: {
              legend: { display: false },
              datalabels:{
                display: false
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                suggestedMax: maxValue // Menyamakan skala dengan chart kiri
              }
            }
          }
        });
      }

      createAgeRangeAudience(){
        this.ageRangeAudience = new Chart("AgeRange", {
          type: 'bar', //this denotes tha type of chart

          data: {// values on X-Axis
            labels: this.influencer?.agerangeaud.labels,
             datasets: [
              {
                label: "Age Range",
                data: this.influencer?.agerangeaud.data,
                backgroundColor: "#ABD4F4",
              }
            ]
          },
          options: {
            // aspectRatio: 1.5,
            aspectRatio: 1.5,
            plugins: {
              legend: {
                display: false
              },
              datalabels:{
                display: false
              }
            }
          }
        });
      }

      activeTab: 'feeds' | 'reels' = 'feeds';

      toggleContent(type: 'feeds' | 'reels') {
        this.activeTab = type;
      }

      get hasReels(): boolean {
        return !!(this.influencer && this.influencer.reels && this.influencer.reels.length > 0);
      }

      get hasFeeds(): boolean {
        return !!(this.influencer && this.influencer.feeds && this.influencer.feeds.length > 0);
      }

      currentIndex: number = 0;

      get currentStory(): StoryDetail | undefined {
        return this.stories[this.currentIndex];
      }

      prevStory(): void {
        if (this.currentIndex > 0) {
          this.currentIndex--;
        }
      }

      nextStory(): void {
        if (this.currentIndex < this.stories.length - 1) {
          this.currentIndex++;
        }
      }

      getStars(rating: number): string[] {
        let stars: string[] = [];

        let fullStars = Math.floor(rating); // Jumlah bintang penuh
        let halfStar = rating % 1 !== 0 ? 1 : 0; // Jika rating memiliki desimal, tambahkan 1 bintang setengah
        let emptyStars = 5 - fullStars - halfStar; // Sisa bintang kosong

        // Tambahkan bintang penuh
        for (let i = 0; i < fullStars; i++) {
          stars.push('fa-star checked');
        }

        // Tambahkan bintang setengah (jika ada)
        if (halfStar) {
          stars.push('fa-star-half-full');
        }

        // Tambahkan bintang kosong
        for (let i = 0; i < emptyStars; i++) {
          stars.push('fa-star nul');
        }

        return stars;
      }

      getProfileBrand(byte: any, name:any, type:any){
        if (byte) {
          const imageBlob = this.dataURItoBlob(byte, type);
          const imageFile = new File([imageBlob], name, { type: type });
          return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile));
        }
        else{
          return "";
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

  // for confirm popup
  displayConfirmation: boolean = false;
  confirmHeader: any;
  confirmBody: any;

  askConfirm(id: number) {
    if (id == 1) {
      this.displayConfirmation = true;
      this.confirmHeader = "Cancel edit";
      this.confirmBody = "Are you sure want to cancel edit?";
    } else if (id == 2) {
      this.displayConfirmation = true;
      this.confirmHeader = "Save edit";
      this.confirmBody = "Are you sure want to save edit?";
    }
  }

  confirmConfirm() {
    if (this.confirmHeader == 'Cancel edit') {
      this.displayConfirmation = false;
      this.cancelEdit();
    } else if (this.confirmHeader = 'Save edit') {
      this.displayConfirmation = false;
      this.saveEdit();
    }
  }

  cancelEdit() {
    this.router.navigate(['/profile-influencer']);
  }

  saveEdit() {
    if (!this.storyActive) {
      this.profileForm.patchValue({ storyPrice: "test" });

    }
    if (!this.feedsActive) {
      this.profileForm.patchValue({
        feedsPrice: 0
      })
    }
    if (!this.reelsActive) {
      this.profileForm.patchValue({
        reelsPrice: 0
      })
    }

    this.userService.editProfileInfluencer(this.profileForm.value).subscribe(
      (data) => {
        localStorage.setItem("name", this.profileForm.get("name")?.value);
        this.router.navigate(['/profile-influencer'], {state: {editSuccess: true}})
      },
      (error) => {
        console.log(error);
      }
    )
  }

  submitted: boolean = false;
  emailExist: boolean = false;
  onSave() {
    // validasi
    this.submitted = true;
    if (this.profileForm.get('email')?.value == this.influencer['email']) {
      if (!this.maxCategoryLimitExceed) {
        this.askConfirm(2);
      }
    } else {
      this.userService.validateEmail(this.profileForm.get('email')?.value).subscribe(
        data => {
          if (data.length == 0) {
            if (this.profileForm.valid && !this.maxCategoryLimitExceed) {
              this.askConfirm(2);
            }
          } else { // if email exist, show error
            this.emailExist = true;
          }
        }
      )
    }

  }

  get profileFormControl() {
    return this.profileForm.controls;
  }

  onSubmit() {

  }

  storyActive: boolean = false;
  storyCheckBoxToggle() {
    if (this.storyActive) {
      this.profileForm.get("storyPrice")?.enable();
    } else {
      this.profileForm.get("storyPrice")?.disable();
    }
  }

  feedsActive: boolean = false;
  feedsCheckBoxToggle() {
    if (this.feedsActive) {
      this.profileForm.get("feedsPrice")?.enable();
    } else {
      this.profileForm.get("feedsPrice")?.disable();
    }
  }

  reelsActive: boolean = false;
  reelsCheckBoxToggle() {
    if (this.reelsActive) {
      this.profileForm.get("reelsPrice")?.enable();
    } else {
      this.profileForm.get("reelsPrice")?.disable();
    }
  }

}
