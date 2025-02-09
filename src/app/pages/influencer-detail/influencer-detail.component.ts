import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { InfluencerService } from '../../services/influencer.service';
Chart.register(...registerables);

@Component({
  selector: 'app-influencer-detail',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './influencer-detail.component.html',
  styleUrl: './influencer-detail.component.css'
})
export class InfluencerDetailComponent implements OnInit {
  influencerId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private influencerService: InfluencerService
  ) {}

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
          console.log('Detail influencer:', response);
        },
        (error) => {
          console.error('Error get detail influencer:', error);
        }
      );
    }

    this.createChart();
  }
  public chart: any;

  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','2','3','4','5','6','7','8','9','10','11','12','13','14','15'],
	       datasets: [
          {
            label: "Sales",
            data: ['467','576','572'],
          }
        ]
      },
      options: {
        aspectRatio: 1.5,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}
