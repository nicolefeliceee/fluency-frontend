import { Component, NgZone, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { AlertErrorComponent } from "../../../components/alert-error/alert-error.component";
import { PaymentMethodPopupComponent } from "../project-create/payment-method-popup/payment-method-popup.component";
import { ConfirmationPopupComponent } from "../../../components/confirmation-popup/confirmation-popup.component";
import { ProjectDetailPopupComponent } from "../project-create/project-detail-popup/project-detail-popup.component";
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/project.service';
import { Router } from '@angular/router';
import { InfluencerService } from '../../../services/influencer.service';
import { InstagramService } from '../../../services/instagram.service';
import { MidtransService } from '../../../services/midtrans.service';
import { ProjectDetail } from '../../../models/project-detail';
import { BrandService } from '../../../services/brand.service';
import { error } from 'console';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AlertErrorComponent, PaymentMethodPopupComponent, ConfirmationPopupComponent, ProjectDetailPopupComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit{
  // for userType
  instagramId: any = localStorage.getItem('instagram_id');

  brandId: any;

  // for error alert
  createError: boolean = false;

  // for confirmation popup
  displayConfirmation: boolean = false;
  confirmBody!: string;
  confirmHeader!: string;

  // for select payment method popup
  displayPaymentMethod: boolean = false;

   // for field in project
    projectTitle: any;
    projectDescription: any;
    projectMention: any;
    projectCaption: any;
    projectHashtag: any;
    selectedinfluencer: any;
    storyDetailList: ProjectDetail[] = [];
    feedsDetailList: ProjectDetail[] = [];
  reelsDetailList: ProjectDetail[] = [];

  // for prices from influencer
  storyPrice?: any = '100000';
  feedsPrice?: any = '200000';
  reelsPrice?: any = '300000';

  selectedInfluencerId?: any = '';
  selectedInfluencer?: any = null;
  brand?: any = null;
  newProject: any;

    constructor(
      private projectService: ProjectService,
      private router: Router,
      // private fb: FormBuilder,
      private influencerService: InfluencerService,
      private brandService: BrandService,
      private instagramService: InstagramService,
      private midtransService: MidtransService,
      private ngZone: NgZone
    ) {
      const navigation = this.router.getCurrentNavigation();
      this.newProject = navigation?.extras.state?.['project'];
      // console.log(this.newProject);;
      // this.influencerSelectedProject = navigation?.extras.state?.['newProject'];
  }

  ngOnInit(): void {
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

    console.log(this.selectedInfluencerId);
    if (!this.instagramId) {
      if (this.selectedInfluencerId != '') {
        this.influencerService.getInfluencerById(this.selectedInfluencerId).subscribe(
          (data) => {
            // console.log(data);
            this.selectedInfluencer = data;
            this.instagramService.getProfile(this.selectedInfluencer.token, this.selectedInfluencer['instagramid']).subscribe(
              (data) => {
                this.selectedInfluencer.username = data.username
              }
            )
          },
          (error) => {
            console.log(error);
          }
        )
      }
    } else {
      this.brandService.getBrandById(this.brandId).subscribe(
        (data) => {
          console.log(data);
          this.brand = data;
        },
        (error) => {
          console.log(error);
        }
      )
    }


  }



  confirmConfirm() {
    if (this.confirmHeader == 'Finish payment') {
      this.selectPayment();
    } else {
      // create project with status draft
      this.saveProject('1');
    }
  }

  confirmCancel() {
    this.displayConfirmation = false;
  }

  selectPayment() {
    this.displayPaymentMethod = true;
  }

  paymentCancel() {
    this.displayPaymentMethod = false;
  }


  checkout(method: any) {

    if (method == 'wallet') {
      // validate wallet balance
    } else if (method == 'other') {
      // STEPS

      // get refnum from backend
      let refNum = this.newProject['reference_number'];
      let amount = this.reelsDetailList.length * this.reelsPrice + this.feedsDetailList.length * this.feedsPrice + this.storyDetailList.length * this.storyPrice;

      // get transaction token dulu from backend
      this.midtransService.getTransactionToken(refNum, amount).subscribe(
        (data) => {
           // munculin snap di frontend
          if (window.snap) {
            window.snap.pay(data, {
              onSuccess: (result: any) => {
                console.log('Payment success:', result);
                // create project with status waiting
                this.saveProject('3');

              },
              onPending: (result: any) => {
                console.log('Payment pending:', result);
                // Handle pending payment here
                // create project with status unpaid
                this.saveProject('2');

              },
              onError: (error: any) => {
                console.error('Payment error:', error);
                // Handle error here
                // create project with status unpaid
                this.saveProject('2');
              },
              onClose: function() {
                console.log('Payment popup closed.');

              }
            });
          }
        }
      )
    }
  }


  saveProject(statusId: any) {
    // this.newProject.projectDetails = [];

    // this.newProject.userId = localStorage.getItem("user_id") || '';
    // this.newProject.statusId = statusId;
    // this.newProject.title = this.projectTitle;
    // this.newProject.description = this.projectDescription;
    // this.newProject.mention = this.projectMention;
    // this.newProject.caption = this.projectCaption;
    // this.newProject.hashtag = this.projectHashtag;
    // this.newProject.influencerId = this.selectedInfluencerId;
    // this.newProject.projectDetails = this.newProject.projectDetails.concat(this.storyDetailList);
    // this.newProject.projectDetails = this.newProject.projectDetails.concat(this.feedsDetailList);
    // this.newProject.projectDetails = this.newProject.projectDetails.concat(this.reelsDetailList);

    // update
    this.projectService.editProject(this.newProject).subscribe(
      (data) => {
        console.log(data);
        this.ngZone.run(() => {
          this.router.navigate(['/project'], {state: {status: true}});
        })
        },
        (error) => {
          console.log(error);
          this.createError = true;
        }
    )

  }


  getProfilePictureUrl(profilePicture: string): string {
    return profilePicture.replace(/\\"/g, ''); // Menghapus karakter escape
  }

  askConfirm(id: number) {
    if (id == 1) {
      this.confirmHeader = "Cancel order";
      this.confirmBody = "Are you sure want to cancel this order?"
      this.displayConfirmation = true;
    } else if (id == 2) {
      this.confirmHeader = "Finish payment";
      this.confirmBody = "Are you sure want to go to payment?"
      this.displayConfirmation = true;
    }
  }

  goToPayment() {
    if (this.storyDetailList.length == 0 && this.feedsDetailList.length == 0 && this.reelsDetailList.length == 0) {
      this.displayConfirmation = false;
    } else {
      this.askConfirm(2);
    }
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

        storyList.push(newDetail);
      }
    })

    return storyList;
  }

  getFeedsListFromDraft(projectDetails: any[] | ProjectDetail[]):any[] {
    let storyList: ProjectDetail[] = [];
    projectDetails.forEach(element => {
      if (element['mediatype_id'] == '2'|| element.mediatypeId == '2') {
        element.tempId = storyList.length;

        let newDetail = new ProjectDetail();
        newDetail.deadlineDate = element['deadline_date'] || element.deadlineDate;
        newDetail.deadlineTime = element['deadline_time'] || element.deadlineTime;
        newDetail.note = element.note;
        newDetail.mediatypeId = element['mediatype_id'] || element.mediatypeId;
        newDetail.tempId = element.tempId;

        storyList.push(newDetail);
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

        storyList.push(newDetail);
      }
    })

    return storyList;
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

  // for project detail popup
  displayDetail: boolean = false;
  detailHeader!: string;
  detailMedia!: string;
  detailId!: number;
  detailForm: any;

  uploadLink(item: any) {
    console.log(item);
    this.detailForm = {};
    this.detailForm['mediatypeId'] = item['mediatype_id'];
    this.detailForm['link'] = item['link'];
    this.detailForm['deadlineDate'] = item['deadline_date'];
    this.detailForm['deadlineTime'] = item['deadline_time'];
    this.detailForm['note'] = item['note'];
    console.log(this.detailForm);
    this.detailHeader = this.getMediaLabel(item['mediatype_id']);
    this.displayDetail = true;
  }

  openLink() {

  }

  copyLink() {

  }

  detailConfirm(form: any) {

  }

  detailCancel() {
    this.displayDetail = false;
  }

  rejectProject() {

  }

  acceptProject() {

  }

  finishProject() {

  }

}
