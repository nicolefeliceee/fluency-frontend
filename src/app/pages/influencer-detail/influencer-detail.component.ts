import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, Colors, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { InfluencerService } from '../../services/influencer.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import ChartLabels from 'chart.js-plugin-labels-dv';
import { getChartLabelPlugin, PLUGIN_ID } from 'chart.js-plugin-labels-dv';
import { text } from 'node:stream/consumers';
// Chart.register(...registerables, ChartLabels);
Chart.register(getChartLabelPlugin());
Chart.register(...registerables);
Chart.register(...registerables, ChartDataLabels);

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
  selector: 'app-influencer-detail',
  standalone: true,
  imports: [HeaderComponent, CommonModule, InfluencerDetailComponent],
  templateUrl: './influencer-detail.component.html',
  styleUrl: './influencer-detail.component.css'
})
export class InfluencerDetailComponent implements OnInit {
  influencer: InfluencerDetail | null = null; // Tipe array Influencer
  influencerId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private influencerService: InfluencerService
  ) {}

  stories: StoryDetail[] = [];

  ngOnInit(): void {
    // ambil id influencer dari path
    this.influencerId = this.route.snapshot.paramMap.get('id'); // Ambil ID dari URL
    console.log('Influencer ID:', this.influencerId);

    // get detail influencer
    if (this.influencerId == null){
      console.log("inf id null, error");
    }
    else{
      this.influencerService.getDetailInfluencer(this.influencerId).subscribe(
        (response) => {
          this.influencer = response;
          this.stories = this.influencer?.story || [];
          console.log('Detail influencer:', this.influencer);

          this.createChart();
        },
        (error) => {
          console.error('Error get detail influencer:', error);
        }
      );
    }

    // this.createChart();
  }
  public follGrowth: any;
  public reach: any;
  public genderAudience: any;
  public onlineFollAudience: any;
  public topCitiesAudience: any;
  public topCitiesLeft: any;
  public topCitiesRight: any;
  public ageRangeAudience: any;

  createChart(){
    this.createFollGrowth();
    this.createReach();
    this.createGenderAudience();
    this.createOnlineFollAudience();
    this.createTopCitiesAudience();
    this.createAgeRangeAudience();
  }

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
    const total = numericData.reduce((acc, val) => acc + val, 0) || 1; // Hitung total, default 1 untuk mencegah error

    // Ubah label gender
    const genderLabels = this.influencer?.genderaud.labels.map(label => {
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
    const data = this.influencer?.topcitiesaud.data?.map(value => Number(value) || 0) || []; // Konversi ke angka

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


}
