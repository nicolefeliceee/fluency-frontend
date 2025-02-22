import { Component, NgZone, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { AlertErrorComponent } from "../../../components/alert-error/alert-error.component";
import { PaymentMethodPopupComponent } from "../project-create/payment-method-popup/payment-method-popup.component";
import { ConfirmationPopupComponent } from "../../../components/confirmation-popup/confirmation-popup.component";
import { ProjectDetailPopupComponent } from "../project-create/project-detail-popup/project-detail-popup.component";
import { CommonModule, DecimalPipe } from '@angular/common';
import { ProjectService } from '../../../services/project.service';
import { Router, RouterLink } from '@angular/router';
import { InfluencerService } from '../../../services/influencer.service';
import { InstagramService } from '../../../services/instagram.service';
import { MidtransService } from '../../../services/midtrans.service';
import { ProjectDetail } from '../../../models/project-detail';
import { BrandService } from '../../../services/brand.service';
import { AlertSuccessComponent } from "../../../components/alert-success/alert-success.component";
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review';
import { error } from 'console';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AlertErrorComponent, PaymentMethodPopupComponent, ConfirmationPopupComponent, ProjectDetailPopupComponent, AlertSuccessComponent, RouterLink, FormsModule],
  providers: [DecimalPipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit{
  // for userType
  instagramId: any = localStorage.getItem('instagram_id');

  brandId: any;

  // for error alert
  createError: boolean = false;
  generalError: boolean = false;

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
  storyPrice?: any;
  feedsPrice?: any;
  reelsPrice?: any;

  projectAlreadyReviewed!: boolean;
  fadeOut: boolean = false;

  selectedInfluencerId?: any = '';
  selectedInfluencer?: any = null;

  brand?: any = null;
  profilePicBrand: any;

  newProject: any;
  projectId: any;

    constructor(
      private router: Router,
      private projectService: ProjectService,
      private influencerService: InfluencerService,
      private brandService: BrandService,
      private instagramService: InstagramService,
      private midtransService: MidtransService,
      private reviewService: ReviewService,
      private ngZone: NgZone,
      private decimalPipe: DecimalPipe,
      private sanitizer: DomSanitizer
    ) {
      const navigation = this.router.getCurrentNavigation();
      this.projectId = navigation?.extras.state?.['projectId'];
      // console.log(this.newProject);;
      // this.influencerSelectedProject = navigation?.extras.state?.['newProject'];
  }

  ngOnInit(): void {
    this.projectService.getProjectbyId(this.projectId).subscribe(
      data => {
        console.log(data);
        this.newProject = data;
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

        if (this.selectedInfluencerId != '') {
          this.influencerService.getInfluencerById(this.selectedInfluencerId).subscribe(
            (data) => {
              this.selectedInfluencer = data;
              this.reelsPrice = this.getNominalNumber(data['reelsprice']);
              this.feedsPrice = this.getNominalNumber(data['feedsprice']);
              this.storyPrice = this.getNominalNumber(data['storyprice']);
              this.instagramService.getProfile(this.selectedInfluencer.token, this.selectedInfluencer['instagramid']).subscribe(
                (data) => {
                  this.selectedInfluencer.username = data.username
                }
              )
              // this.profilePicInfluencer = this.sanitize.bypassSecurityTrustResourceUrl(this.selectedInfluencer.profilepicture);
            },
            (error) => {
              console.log(error);
            }
          )
        }

          // logged in user == influencer
        if (this.instagramId) {
          this.brandService.getBrandById(this.brandId).subscribe(
            (data) => {
              this.brand = data;
              if (data['profile_picture_byte']) {
                const imageBlob = this.dataURItoBlob(data['profile_picture_byte'], data['profile_picture_type']);
                const imageFile = new File([imageBlob], data['profile_picture_name'], { type: data['profile_picture_type'] });
                this.profilePicBrand = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile));
              }
            },
            (error) => {
              console.log(error);
            }
          )
        }
      },
      error => {
        console.log(error);
      }
    )

    this.reviewService.getReviewByProjectHeaderId(this.projectId).subscribe(
      (data) => {
        this.projectAlreadyReviewed = true;
      },
      error => {
        this.projectAlreadyReviewed = false;
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
    this.newProject['project_details'] = [];

    this.newProject['user_id'] = localStorage.getItem("user_id") || '';
    this.newProject['status_id'] = statusId;
    this.newProject.title = this.projectTitle;
    this.newProject.description = this.projectDescription;
    this.newProject.mention = this.projectMention;
    this.newProject.caption = this.projectCaption;
    this.newProject.hashtag = this.projectHashtag;
    this.newProject['influencer_id'] = this.selectedInfluencerId;
    this.newProject['project_details'] = this.newProject['project_details'].concat(this.storyDetailList);
    this.newProject['project_details'] = this.newProject['project_details'].concat(this.feedsDetailList);
    this.newProject['project_details'] = this.newProject['project_details'].concat(this.reelsDetailList);

    console.log(this.newProject);
    // update
    this.projectService.editProject(this.newProject).subscribe(
      (data) => {
        this.ngZone.run(() => {
          this.router.navigate(['/project'], {state: {status: true, expectedStatus: statusId}});
        })
      },
      (error) => {
        console.log(error);
        this.createError = true;
      }
    )

  }

  profilePicInfluencer?: any;

  getProfilePictureUrl(profilePicture: string): any {
   // Menghapus karakter escape
    return profilePicture.replace(/\\"/g, '');
  }

  askConfirm(id: number) {
    if (id == 1) {
      this.confirmHeader = "Cancel order";
      this.confirmBody = "Are you sure want to cancel this order?";
      this.displayConfirmation = true;
    } else if (id == 2) {
      this.confirmHeader = "Finish payment";
      this.confirmBody = "Are you sure want to go to payment?";
      this.displayConfirmation = true;
    } else if (id == 3) {
      this.confirmHeader = "Accept project";
      this.confirmBody = "Are you sure want to accept this project?";
      this.displayConfirmation = true;
    } else if (id == 4) {
      this.confirmHeader = "Reject project";
      this.confirmBody = "Are you sure want to reject this project?";
      this.displayConfirmation = true;
    } else if (id == 5) {
      this.confirmHeader = "Finish project";
      this.confirmBody = "Are you sure want to mark this project as finished?";
      this.displayConfirmation = true;
    } else if (id == 6) {
      this.confirmHeader = "Mark project as done";
      this.confirmBody = "Are you sure want to mark this project as done? Payment will be transferred to influencer";
      this.displayConfirmation = true;
    } else if (id == 7) {
      this.confirmHeader = "Submit rating & review";
      this.confirmBody = "Are you sure want to submit this rating & review?";
      this.displayConfirmation = true;
    }
  }

  confirmConfirm() {
    if (this.confirmHeader == 'Cancel order') {
      this.selectPayment();
    } else if(this.confirmHeader == 'Finish payment') {
      // create project with status waiting
      this.saveProject('3');
    } else if (this.confirmHeader == 'Accept project') {
      this.acceptProject();
    } else if (this.confirmHeader == 'Reject project') {
      this.rejectProject();
    } else if (this.confirmHeader == 'Finish project') {
      this.finishProject();
    } else if (this.confirmHeader == 'Mark project as done') {
      this.markAsDone();
    } else if (this.confirmHeader == 'Submit rating & review') {
      // this.finishProject();
      this.submitReview();
    }
    this.displayConfirmation = false;
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
        newDetail.link = element.link;
        newDetail.id = element.id
        newDetail.instagramMediaId = element['instagram_media_id'];

        storyList.push(newDetail);
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

        console.log(newDetail);
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
        newDetail.link = element.link;
        newDetail.id = element.id
        newDetail.instagramMediaId = element['instagram_media_id'];

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

  uploadSuccess: boolean = false;

  uploadLink(item: any) {
    // console.log(item);
    this.detailForm = {};
    this.detailForm['mediatypeId'] = item['mediatype_id'];
    this.detailForm['tempId'] = item['id'];
    this.detailForm['link'] = item['link'];
    this.detailForm['deadlineDate'] = item['deadline_date'];
    this.detailForm['deadlineTime'] = item['deadline_time'];
    this.detailForm['note'] = item['note'];
    this.detailId = item['id'];
    // console.log(this.detailForm);
    this.detailHeader = this.getMediaLabel(item['mediatype_id']);
    this.displayDetail = true;
  }

  openLink(item: any) {
    const url = item['link']; // Replace with your link
    window.open(url, '_blank');
  }

  copiedSuccess: boolean = false;

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

  openAnalytics(item: any) {
    this.router.navigate(['project/detail/performance-analytics'], { state: { projectDetailId: item['id'], projectHeaderId: this.projectId } });
  }

  detailConfirm(form: any) {
    this.detailForm = form;
    console.log(this.detailForm);
    this.projectService.editProjectDetail(this.detailForm['value']).subscribe(
      (data) => {
        this.updateProjectDetail(data);
        this.uploadSuccess = true;
        setTimeout(() => this.uploadSuccess = false, 2000);
      },
      (error) => {
        console.log(error);
      }
    )
    this.displayDetail = false;
  }

  detailCancel() {
    this.displayDetail = false;
  }

  rejectProject() {
    this.saveProject('6');
  }

  acceptProject() {
    this.saveProject('4');
  }


  notFinishedError: boolean = false;

  finishProject() {
    let existNull = false;
    this.newProject['project_details'].forEach((element: any) => {
      if (!element['link']) {
        existNull = true;
      }
    });

    if (existNull) {
      this.notFinishedError = true;
    } else {
      this.saveProject('5');
    }
  }

  formatPrice(price: any) {
    if (price) {
      let formatted = this.decimalPipe.transform(price, '1.0-0');
      return formatted!.replace(/,/g, '.');
    }
    return '';
  }

  updateProjectDetail(data: any) {
    console.log(data);
    this.newProject['project_details'].forEach((element: any) => {
      console.log(element);
      if (element['id'] == data['id']) {
        element['status_id'] = '5';
        element['link'] = data['link'];
        element['instagram_media_id'] = data['instagram_media_id'];
      }
    });

    console.log(this.newProject['project_details']);
    this.storyDetailList = this.getStoryListFromDraft(this.newProject['project_details']);
    this.feedsDetailList = this.getFeedsListFromDraft(this.newProject['project_details']);
    this.reelsDetailList = this.getReelsListFromDraft(this.newProject['project_details']);

    console.log(this.feedsDetailList);
    // window.location.reload();
  }

  markAsDone() {
    this.saveProject('6');
  }

  review: any;
  rating: any = 0;

  reviewSuccess: boolean = false;

  submitReview() {
    console.log(6 - this.rating);
    console.log(this.review);

    const request = new Review();
    request.project_header_id = this.projectId;
    request.rating = this.rating;
    request.review = this.review;

    this.reviewService.createReview(request).subscribe(
      (data) => {
        this.reviewSuccess = true;
        this.projectAlreadyReviewed = true;

        setTimeout(() => {
          this.reviewSuccess = false;
        },2000);
      },
      (error) => {
        this.generalError = true;
      }
    )
  }

}
