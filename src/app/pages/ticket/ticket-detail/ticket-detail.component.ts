import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { InfluencerService } from '../../../services/influencer.service';
import { BrandService } from '../../../services/brand.service';
import { InstagramService } from '../../../services/instagram.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProjectDetail } from '../../../models/project-detail';
import { AlertErrorComponent } from "../../../components/alert-error/alert-error.component";
import { AlertSuccessComponent } from "../../../components/alert-success/alert-success.component";
import { ConfirmationPopupComponent } from "../../../components/confirmation-popup/confirmation-popup.component";

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, AlertErrorComponent, AlertSuccessComponent, ConfirmationPopupComponent],
  providers: [DecimalPipe],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit{

  newProject: any;
  ticket: any;
  ticketId: any;

  // for field in project
  brandId: any;
  brand?: any = null;
  profilePicBrand: any;

  selectedInfluencerId?: any = '';
  selectedInfluencer?: any = null;

  projectTitle: any;
  projectDescription: any;
  projectMention: any;
  projectCaption: any;
  projectHashtag: any;
  selectedinfluencer: any;
  storyDetailList: ProjectDetail[] = [];
  feedsDetailList: ProjectDetail[] = [];
  reelsDetailList: ProjectDetail[] = [];

  // for prices from nominal
  storyPrice?: any = 0;
  feedsPrice?: any = 0;
  reelsPrice?: any = 0;

  // for alerts
  generalError: boolean = false;
  copiedSuccess: boolean = false;

  constructor(
      private router: Router,
      private projectService: ProjectService,
      private influencerService: InfluencerService,
      private brandService: BrandService,
      private instagramService: InstagramService,
      private ngZone: NgZone,
      private decimalPipe: DecimalPipe,
      private sanitizer: DomSanitizer
    ) {
      const navigation = this.router.getCurrentNavigation();
      this.ticketId = navigation?.extras.state?.['ticketId'];
    }

  ngOnInit(): void {
      this.projectService.getTicketbyId(this.ticketId).subscribe(
        data => {
          console.log(data);
          this.ticket = data;
          this.newProject = data['project_header'];
          console.log(this.newProject);
          this.brandId = this.newProject['brand_id'];
          this.projectTitle = this.newProject.title;
          this.projectDescription = this.newProject.description;
          this.projectMention = this.newProject.mention;
          this.projectCaption = this.newProject.caption;
          this.projectHashtag = this.newProject.hashtag;
          this.selectedInfluencerId = this.newProject['influencer_id'];
          this.storyDetailList = this.getStoryListFromDraft(this.newProject['project_details']);
          this.feedsDetailList = this.getFeedsListFromDraft(this.newProject['project_details']);
          this.reelsDetailList = this.getReelsListFromDraft(this.newProject['project_details']);


          this.influencerService.getInfluencerById(this.selectedInfluencerId).subscribe(
            (data) => {
              this.selectedInfluencer = data;
            },
            (error) => {
              console.log(error);
            }
          )

          this.brandService.getBrandById(this.brandId).subscribe(
            (data) => {
              this.brand = data;
            },
            (error) => {
              console.log(error);
            }
          )

        },
        error => {
          console.log(error);
        }
      )

  }

  public dataURItoBlob(picBytes: any, imageType: any) {
    const byteString = window.atob(picBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8array], { type: imageType });
    return blob;
  }


  getNominalNumber(nominal: string) {
    if (nominal.includes('.')) {
      nominal = nominal.replaceAll('.', '');
    }

    return nominal;
  }


  // for confirmation popup
  displayConfirmation: boolean = false;
  confirmBody!: string;
  confirmHeader!: string;

  askConfirm(id: number) {
    if (id == 1) {
      this.confirmHeader = "Refund";
      this.confirmBody = "Are you sure want to refund this project?";
      this.displayConfirmation = true;
    } else if (id == 2) {
      this.confirmHeader = "Resolve";
      this.confirmBody = "Are you sure want to resolve this ticket?";
      this.displayConfirmation = true;
    }
  }

  confirmCancel() {
    this.displayConfirmation = false;
  }

  confirmConfirm() {
    if (this.confirmHeader == 'Refund') {

    } else if(this.confirmHeader == 'Resolve') {
      this.resolve();
    }

    this.displayConfirmation = false;
  }

  resolve() {
    console.log("resolve")
    this.projectService.editTicketStatus(this.ticketId, 'resolved').subscribe(
      (data) => {
        this.router.navigate(['/ticket'], { state: { resolveSuccess: true, expectedStatus: 'Resolved' } });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  profilePicInfluencer?: any;

  getProfilePictureUrl(profilePicture: string): any {
   // Menghapus karakter escape
    return profilePicture.replace(/\\"/g, '');
  }

  getStoryListFromDraft(projectDetails: any[] | ProjectDetail[]):any[] {
    let storyList: ProjectDetail[] = [];
    console.log(projectDetails);

    // if(projectDetails instanceof ProjectDetail[])

    projectDetails.forEach(element => {
      if (element['mediatype_id'] == '1' || element.mediatypeId == '1') {
        element.tempId = storyList.length;

        let newDetail = new ProjectDetail();
        newDetail.deadlineDate = element['deadline_date'] || element.deadlineDate;
        newDetail.deadlineTime = element['deadline_time'] || element.deadlineTime;
        newDetail.note = element.note;
        newDetail.mediatypeId = element['mediatype_id'] || element.mediatypeId;
        newDetail.tempId = element.tempId;
        newDetail.link = element.link;
        newDetail.id = element.id
        newDetail.instagramMediaId = element['instagram_media_id'];

        storyList.push(newDetail);

        this.storyPrice = element['nominal'];
      }
    })

    return storyList;
  }

  getFeedsListFromDraft(projectDetails: any[] | ProjectDetail[]):any[] {
    let storyList: ProjectDetail[] = [];
    console.log(projectDetails);
    projectDetails.forEach(element => {
      if (element['mediatype_id'] == '2'|| element.mediatypeId == '2') {
        element.tempId = storyList.length;
        console.log(element);

        let newDetail = new ProjectDetail();
        newDetail.deadlineDate = element['deadline_date'] || element.deadlineDate;
        newDetail.deadlineTime = element['deadline_time'] || element.deadlineTime;
        newDetail.note = element.note;
        newDetail.mediatypeId = element['mediatype_id'] || element.mediatypeId;
        newDetail.tempId = element.tempId;
        newDetail.link = element.link;
        newDetail.id = element.id
        newDetail.instagramMediaId = element['instagram_media_id'];

        storyList.push(newDetail);
        this.feedsPrice = element['nominal'];
      }
    })

    return storyList;
  }

  getReelsListFromDraft(projectDetails: any[] | ProjectDetail[]):any[] {
    let storyList: ProjectDetail[] = [];
    projectDetails.forEach(element => {
      if (element['mediatype_id'] == '3' || element.mediatypeId == '3') {
        element.tempId = storyList.length;

        let newDetail = new ProjectDetail();
        newDetail.deadlineDate = element['deadline_date'] || element.deadlineDate;
        newDetail.deadlineTime = element['deadline_time'] || element.deadlineTime;
        newDetail.note = element.note;
        newDetail.mediatypeId = element['mediatype_id'] || element.mediatypeId;
        newDetail.tempId = element.tempId;
        newDetail.link = element.link;
        newDetail.id = element.id
        newDetail.instagramMediaId = element['instagram_media_id'];

        storyList.push(newDetail);
        this.reelsPrice = element['nominal'];
      }
    })

    return storyList;
  }

  formatPrice(price: any) {
    if (price) {
      let formatted = this.decimalPipe.transform(price, '1.0-0');
      return formatted!.replace(/,/g, '.');
    }
    return '';
  }

  openLink(item: any) {
    const url = item['link']; // Replace with your link
    window.open(url, '_blank');
  }

  copyLink(item: any) {
    if (item['link']) {
      navigator.clipboard.writeText(item['link']).then(() => {
        // alert('Copied to clipboard!');
        this.copiedSuccess = true;
        setTimeout(() => this.copiedSuccess = false, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    } else {
      alert('No value to copy!');
    }
  }

  backButton() {
    let status: string = this.ticket['status'];
    this.ngZone.run(() => {
      this.router.navigate(['/ticket'], { state: { expectedStatus: status} });
    })
  }

  getMediaLabel(id: string) {
    if (id == '1') {
      return 'Story';
    } else if (id == '2') {
      return 'Feeds';
    } else if (id == '3') {
      return 'Reels';
    }
    return '';
  }

  getStatusLabel(id: string) {
    if (id == '3') {
      return 'Waiting';
    } else if (id == '4') {
      return 'Ongoing';
    } else if (id == '5') {
      return 'Done';
    }
    return '';
  }

}
