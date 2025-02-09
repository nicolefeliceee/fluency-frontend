import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { TabComponent } from "../../components/tab/tab.component";
import { StatusService } from '../../services/status.service';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from "./project-card/project-card.component";
import { Router, RouterLink } from '@angular/router';
import { ProjectCreate } from '../../models/project-create';
import { error } from 'node:console';
import { AlertSuccessComponent } from "../../components/alert-success/alert-success.component";
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [HeaderComponent, TabComponent, CommonModule, ProjectCardComponent, RouterLink, AlertSuccessComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit, OnChanges {

  // for checking usertype
  instagramId: any;

  statusOptions: any[] = [];
  projectList!: ProjectCreate[];
  selectedStatus: any;

  createSuccess: boolean = false;

  constructor(
    private statusService: StatusService,
    private projectService: ProjectService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.createSuccess = navigation?.extras.state?.['status'];
  };

  loadData() {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.loadData();

    this.instagramId = localStorage.getItem('instagram_id');

    if (this.instagramId != null) {
      this.selectedStatus = '3';
    } else {
      this.selectedStatus = '1';
    }


    this.statusService.getAllStatus().subscribe(
      (data) => {
        for (let i = 0; i < data.length; i++) {
          if (localStorage.getItem('instagram_id') != null && data[i]['for_influencer']) {
            this.statusOptions.push(data[i]);
          }
          if (localStorage.getItem('instagram_id') == null) {
            this.statusOptions.push(data[i]);
          }
        }

      },
      (error) => {
        console.log(error);
      }
    )

    this.projectService.getProjects(this.selectedStatus, localStorage.getItem("user_id") || '').subscribe(
      (data) => {
        this.projectList = data;
      }
    )


  }

  getProjectsByStatus(id: any) {
    this.loadData();
    this.selectedStatus = id;
    this.projectService.getProjects(id, localStorage.getItem("user_id") || '').subscribe(
      (data) => {
        this.projectList = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }





}
