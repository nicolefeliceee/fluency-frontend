import { Component, Input, OnInit } from '@angular/core';
import { ProjectCreate } from '../../../models/project-create';
import { CommonModule } from '@angular/common';
import { ProjectDetail } from '../../../models/project-detail';
import { Router } from '@angular/router';
import { state } from '@angular/animations';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent implements OnInit {

  brandName?: string;
  @Input() title?: string;

  @Input() project!: any;
  @Input() projectDetails!: any[];
  @Input() mediaTypeUnique?: string[];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.brandName = localStorage.getItem("username") || "";
    this.projectDetails = this.project['project_details'];
    this.mediaTypeUnique = this.getMediaTypeList();
    // console.log(this.project['project_details']);
    // console.log(this.project?.projectDetails);
  }



  getMediaTypeList() {
    console.log(this.project);
    console.log(this.projectDetails);
    let mediaTypeList: string[] = [];
    if (this.projectDetails.length > 0) {
      this.projectDetails.forEach(element => {
        console.log(element);
        if (element["mediatype_id"] == "1" && !mediaTypeList.includes("Story")) {
          mediaTypeList.push("Story");
        } else if (element["mediatype_id"] == "2" && !mediaTypeList.includes("Feeds")) {
          mediaTypeList.push("Feeds");
        } else if (element["mediatype_id"] == "3" && !mediaTypeList.includes("Reels")) {
          mediaTypeList.push("Reels");
        }
      });
    }


    return mediaTypeList;
  }

  viewProjectDetail(project: any) {
    console.log(project);
    if (project['status_id'] == '1') {
      this.router.navigate(['/project/detail'], { state: { draftProject: project } });
    }
  }

}
