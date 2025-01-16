import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ProjectCreate } from '../../../models/project-create';
import { ProjectDetail } from '../../../models/project-detail';
import { error } from 'console';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css'
})
export class ProjectCreateComponent implements OnInit{

  newProject: ProjectCreate = new ProjectCreate();

  createError: boolean = false;

  ngOnInit(): void {

  }

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) { }

  addStory() {

  }

  projectTitle: any;
  projectDescription: any;
  projectMention: any;
  projectCaption: any;
  projectHashtag: any;
  selectedinfluencer: any;
  storyDetail: ProjectDetail[] = [];
  feedsDetail: ProjectDetail[] = [];
  reelsDetail: ProjectDetail[] = [];

  saveToDraft() {
    this.newProject.title = this.projectTitle;
    this.newProject.description = this.projectDescription;
    this.newProject.mention = this.projectMention;
    this.newProject.caption = this.projectCaption;
    this.newProject.hashtag = this.projectHashtag;
    this.newProject.projectDetails.concat(this.storyDetail);
    this.newProject.projectDetails.concat(this.feedsDetail);
    this.newProject.projectDetails.concat(this.reelsDetail);

    this.projectService.createProject(this.newProject).subscribe(
      (data) => {
        this.router.navigate(['/project'], {state: {status: "success"}});
      },
      (error) => {
        console.log(error);
        this.createError = true;
      }
    )
  }

}
