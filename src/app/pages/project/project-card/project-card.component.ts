import { Component, Input, OnInit } from '@angular/core';
import { ProjectCreate } from '../../../models/project-create';
import { CommonModule } from '@angular/common';
import { ProjectDetail } from '../../../models/project-detail';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { InstagramService } from '../../../services/instagram.service';
import { InfluencerService } from '../../../services/influencer.service';

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

  constructor(
    private router: Router,
    private instagramService: InstagramService,
    private influencerService: InfluencerService
  ) { }

  username?: string;
  follower?: number;
  profilePic?: string;

  ngOnInit(): void {
    this.brandName = localStorage.getItem("username") || "";
    this.projectDetails = this.project['project_details'];
    this.mediaTypeUnique = this.getMediaTypeList();

    this.influencerService.getInfluencerById(this.project['influencer_id']).subscribe(
      (data) => {
          this.instagramService.getProfile(data.token, data['instagramid']).subscribe(
            (data) => {
              this.username = data.username
              this.profilePic = data.profile_picture_url
              this.follower = data.followers_count
            }
          )
      },
      (error) => {
        console.log(error);
      }
    )
  }



  getMediaTypeList() {
    let mediaTypeList: string[] = [];
    if (this.projectDetails.length > 0) {
      this.projectDetails.forEach(element => {
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
    if (project['status_id'] == '1') {
      this.router.navigate(['/project/create'], { state: { draftProject: project } });
    } else {
      this.router.navigate(['/project/detail'], { state: { project: project } });
    }
  }

}
