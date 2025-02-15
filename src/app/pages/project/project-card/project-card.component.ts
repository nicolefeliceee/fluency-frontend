import { Component, Input, OnInit, output } from '@angular/core';
import { ProjectCreate } from '../../../models/project-create';
import { CommonModule } from '@angular/common';
import { ProjectDetail } from '../../../models/project-detail';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { InstagramService } from '../../../services/instagram.service';
import { InfluencerService } from '../../../services/influencer.service';
import { AlertErrorComponent } from "../../../components/alert-error/alert-error.component";

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, AlertErrorComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent implements OnInit {

  brandName?: string;
  @Input() title?: string;
  @Input() index?: number;
  indexClick = output<any>();

  @Input() project!: any;
  @Input() projectDetails!: any[];
  @Input() mediaTypeUnique?: string[];

  // for hire influencer clicked from influencer-card
  @Input() influencerId?: string;

  constructor(
    private router: Router,
    private instagramService: InstagramService,
    private influencerService: InfluencerService
  ) { }

  username?: string;
  follower?: number;
  profilePic?: string;

  ngOnInit(): void {
    this.brandName = localStorage.getItem("name") || "";
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

  influencerAlreadySelected = output<any>();

  viewProjectDetail(project: any) {
    if (this.influencerId) {
      if (this.project['influencer_id']) {
        this.influencerAlreadySelected.emit(true);
        return;
      }
      project['influencer_id'] = this.influencerId;
      this.router.navigate(['/project/create'], { state: { draftProject: project } });
    }
    if (project['status_id'] == '1') {
      this.router.navigate(['/project/create'], { state: { draftProject: project } });
    } else {
      this.router.navigate(['/project/detail'], { state: { projectId: project['id'] } });
    }
  }

  toggleButton() {
    this.indexClick.emit(this.index);
  }

}
