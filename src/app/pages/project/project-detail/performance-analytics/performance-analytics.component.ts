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

  @ViewChild('pieChart') pieChart!: ElementRef;

  projectDetailId: any;
  projectDetail!: any;
  projectHeaderId: any;
  mediaLink: string = '';

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
    console.log(this.projectDetailId);

    this.projectService.getPerformanceAnalyticsById(this.projectDetailId).subscribe(
      (data) => {
        console.log(data);
        this.projectDetail = data;
        this.mediaLink = this.projectDetail['analytics_media_url'];

        console.log(this.projectDetail['analytics_caption'])
      },
      (error) => {
        console.log(error);
      }
    )



  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  chart: any;

  data = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  createChart() {
    console.log(this.pieChart)
    if (this.pieChart && this.pieChart.nativeElement) {
      this.chart = new Chart(this.pieChart.nativeElement, {
        type: 'doughnut',
        data: this.data,
        options: {
          responsive: true,
          aspectRatio: 2.5,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    }

    console.log(this.chart);
  }

  back() {
    console.log(this.projectHeaderId);
    this.router.navigate(['/project/detail'], {state: {projectId: this.projectHeaderId}})
  }
}
