import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../../../components/header/header.component";
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../services/project.service';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController   } from 'chart.js';
import { InstagramService } from '../../../../services/instagram.service';
import { CommonModule } from '@angular/common';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController );

@Component({
  selector: 'app-performance-analytics',
  standalone: true,
  imports: [HeaderComponent, RouterLink, CommonModule],
  templateUrl: './performance-analytics.component.html',
  styleUrl: './performance-analytics.component.css'
})
export class PerformanceAnalyticsComponent implements OnInit, AfterViewInit{

  // @ViewChild('pieChart') pieChart!: ElementRef;

  projectDetailId: any;
  projectDetail!: any;
  projectHeaderId: any;
  mediaLink: string = '';

  sentimentPositive!: number;
  sentimentNeutral!: number;
  sentimentNegative!: number;
  total!: number;

  topComments!: any[];

  constructor(
    private projectService: ProjectService,
    private instagramService: InstagramService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.projectDetailId = navigation?.extras.state?.['projectDetailId'];
    this.projectHeaderId = navigation?.extras.state?.['projectHeaderId'];
  }

  ngOnInit(): void {

    console.log(this.projectHeaderId);

    this.projectService.getPerformanceAnalyticsById(this.projectDetailId).subscribe(
      (data) => {
        this.projectDetail = data;
        this.mediaLink = this.projectDetail['analytics_media_url'];
      },
      (error) => {
        console.log(error);
      }
    )

    this.projectService.getSentimentById(this.projectDetailId).subscribe(
      (data) => {
        this.topComments = data['top_comments'];

        this.sentimentPositive = Number.parseInt(data['sentiment_positive']);
        this.sentimentNeutral = Number.parseInt(data['sentiment_neutral']);
        this.sentimentNegative = Number.parseInt(data['sentiment_negative']);
        this.total = this.sentimentNegative + this.sentimentPositive + this.sentimentNeutral;
        this.createChart();
      },
      (error) => {
        console.log(error);
      }
    )

  }

  ngAfterViewInit(): void {
  }

  chart!: any;

  getData() {
    let labels = [];
    let data = [];
    if (this.sentimentPositive > 0) {
      labels.push('Positive');
      data.push(this.sentimentPositive);
    }
    if (this.sentimentNeutral > 0) {
      labels.push('Neutral');
      data.push(this.sentimentNeutral);
    }
    if (this.sentimentNegative > 0) {
      labels.push('Negative');
      data.push(this.sentimentNegative);
    }

    let chartData = {
      labels: labels,
      datasets: [{
        label: "Sentiment",
        data: data,
        backgroundColor: [
          '#C5EA8B',
          '#87E1E1',
          '#EE9293'
        ],
        hoverOffset: 4
      }]
    };

    return chartData;
  }

  createChart() {
    // if (this.pieChart && this.pieChart.nativeElement) {
      this.chart = new Chart("SentimentAnalyticsPieChart", {
        type: 'doughnut',
        data: this.getData(),
        options: {
          responsive: true,
          aspectRatio: 2.5,
          plugins: {
            datalabels: {
              formatter: (value) => {
                return ((value/this.total)*100).toFixed(1) + '%';
              },
              color: "#000",
            },
            legend: {
              position: 'right'
            }
          }
        }
      });
    // }

  }

  back() {
    this.router.navigate(['/project/detail'], {state: {projectId: this.projectHeaderId}})
  }
}
