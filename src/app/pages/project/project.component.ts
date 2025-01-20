import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [HeaderComponent, TabComponent, CommonModule, ProjectCardComponent, RouterLink, AlertSuccessComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {

  statusOptions!: any[];
  projectList!: any[];
  selectedStatus: any = "1";

  createSuccess: boolean = false;

  constructor(
    private statusService: StatusService,
    private projectService: ProjectService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.createSuccess = navigation?.extras.state?.['status'];
  };

  ngOnInit(): void {

    this.statusService.getAllStatus().subscribe(
      (data) => {
        console.log(data);
        this.statusOptions = data;
        console.log(this.statusOptions)
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
