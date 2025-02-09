import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-influencer-detail',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './influencer-detail.component.html',
  styleUrl: './influencer-detail.component.css'
})
export class InfluencerDetailComponent implements OnInit {
  ngOnInit(): void {
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
