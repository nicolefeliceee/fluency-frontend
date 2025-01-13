import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { TabComponent } from "../../components/tab/tab.component";
import { StatusService } from '../../services/status.service';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from "./project-card/project-card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [HeaderComponent, TabComponent, CommonModule, ProjectCardComponent, RouterLink],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {

  statusOptions!: any[];
  projectList!: any[];
  selectedStatus: any = "1";

  constructor(
    private statusService: StatusService,
    private projectService: ProjectService
  ) { };

  ngOnInit(): void {

    this.statusService.getAllStatus().subscribe(
      (data) => {
        this.statusOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.projectService.getProjects(this.selectedStatus).subscribe(
      (data) => {
        this.projectList = data;
      }
    )

  }



}
