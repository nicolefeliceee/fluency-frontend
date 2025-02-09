import { Component, NgZone, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ProjectCreate } from '../../../models/project-create';
import { ProjectDetail } from '../../../models/project-detail';
import { error, time } from 'console';
import { AlertErrorComponent } from "../../../components/alert-error/alert-error.component";
import { UserService } from '../../../services/user.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationPopupComponent } from "../../../components/confirmation-popup/confirmation-popup.component";
import { ProjectDetailPopupComponent } from "./project-detail-popup/project-detail-popup.component";
import { InfluencerService } from '../../../services/influencer.service';
import { InstagramService } from '../../../services/instagram.service';
import { MidtransService } from '../../../services/midtrans.service';
import { PaymentMethodPopupComponent } from "./payment-method-popup/payment-method-popup.component";

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [HeaderComponent, RouterLink, AlertErrorComponent, CommonModule, FormsModule, ConfirmationPopupComponent, ReactiveFormsModule, ProjectDetailPopupComponent, PaymentMethodPopupComponent],
  templateUrl: './project-create.component.html',
  providers: [DecimalPipe],
  styleUrl: './project-create.component.css'
})
export class ProjectCreateComponent implements OnInit{

  newProject: ProjectCreate = new ProjectCreate();
  draftProject!: any;
  influencerSelectedProject: any;

  // for confirmation popup
  displayConfirmation: boolean = false;
  confirmBody!: string;
  confirmHeader!: string;

  // for project detail popup
  displayDetail: boolean = false;
  detailHeader!: string;
  detailMedia!: string;
  detailId!: number;

  // for select payment method popup
  displayPaymentMethod: boolean = false;

  // for error alert
  createError: boolean = false;
  detailNotSelected: boolean = false;
  influencerNotSelected: boolean = false;

  // for prices from influencer
  storyPrice?: any;
  feedsPrice?: any;
  reelsPrice?: any;

  selectedInfluencerId?: any = '';
  selectedInfluencer?: any = null;

  ngOnInit(): void {
    if (this.draftProject) {
      console.log(this.draftProject);
      this.projectTitle = this.draftProject.title;
      this.projectDescription = this.draftProject.description;
      this.projectMention = this.draftProject.mention;
      this.projectCaption = this.draftProject.caption;
      this.projectHashtag = this.draftProject.hashtag;
      this.selectedInfluencerId = this.draftProject['influencer_id'];
      this.storyDetailList = this.getStoryListFromDraft(this.draftProject['project_details']);
      this.feedsDetailList = this.getFeedsListFromDraft(this.draftProject['project_details']);
      this.reelsDetailList = this.getReelsListFromDraft(this.draftProject['project_details']);
      console.log(this.storyDetailList);
    }

    if (this.influencerSelectedProject) {
      // console.log(this.influencerSelectedProject);
      this.projectTitle = this.influencerSelectedProject.title;
      this.projectDescription = this.influencerSelectedProject.description;
      this.projectMention = this.influencerSelectedProject.mention;
      this.projectCaption = this.influencerSelectedProject.caption;
      this.projectHashtag = this.influencerSelectedProject.hashtag;
      this.selectedInfluencerId = this.influencerSelectedProject.influencerId;
      this.storyDetailList = this.getStoryListFromDraft(this.influencerSelectedProject.projectDetails);
      this.feedsDetailList = this.getFeedsListFromDraft(this.influencerSelectedProject.projectDetails);
      this.reelsDetailList = this.getReelsListFromDraft(this.influencerSelectedProject.projectDetails);
    }

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
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  getNominalNumber(nominal: string) {
    if (nominal.includes('.')) {
      nominal = nominal.replaceAll('.', '');
    }

    return nominal;
  }

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private fb: FormBuilder,
    private influencerService: InfluencerService,
    private instagramService: InstagramService,
    private midtransService: MidtransService,
    private ngZone: NgZone,
    private decimalPipe: DecimalPipe
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.draftProject = navigation?.extras.state?.['draftProject'];
    this.influencerSelectedProject = navigation?.extras.state?.['newProject'];
  }

  // for field in detail popup
  detailDateInput: any;
  detailTimeInput: any;
  detailNoteInput: any;

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

  askConfirm(id: number) {
    if (id == 1) {
      this.confirmHeader = "Save to draft";
      this.confirmBody = "Are you sure want to save this?"
      this.displayConfirmation = true;
    } else if (id == 2) {
      this.confirmHeader = "Go to payment";
      this.confirmBody = "Are you sure want to go to payment?"
      this.displayConfirmation = true;
    } else if(id ==3) {
      this.confirmHeader = "Influencer already selected";
      this.confirmBody = "Are you sure want to find new one?"
      this.displayConfirmation = true;
    } else if (id == 10) {
      this.confirmHeader = "Back";
      this.confirmBody = "Are you sure want to go back? Your changes won't be saved"
      this.displayConfirmation = true;
    }
  }

  confirmConfirm() {
    this.displayConfirmation = false;
    if (this.confirmHeader == 'Go to payment') {
      this.selectPayment();
    } else if (this.confirmHeader == 'Save to draft') {
      // create project with status draft
      this.saveProject('1');
    } else if (this.confirmHeader == 'Back') {
      this.router.navigate(['/project']);
    } else if (this.confirmHeader == 'Influencer already selected') {
      this.findInfluencer();
    }
  }

  confirmCancel() {
    this.displayConfirmation = false;
  }

  generateOrderReference(): string {
    const timestamp = Date.now();
    return `REF-${timestamp}`; // Example: REF-1673245678123
  }

  goToPayment() {
    if (this.storyDetailList.length == 0 && this.feedsDetailList.length == 0 && this.reelsDetailList.length == 0) {
      this.detailNotSelected = true;
      this.displayConfirmation = false;
    } else if (this.selectedInfluencer == null) {
      this.influencerNotSelected = true;
      setTimeout(() => {
        this.influencerNotSelected = false;
      }, 3000);
      this.displayConfirmation = false;
    } else {
      this.askConfirm(2);
    }
  }

  // totalAmount!: number;
  orderSummary: any;
  selectPayment() {
    this.orderSummary = {
      totalAmount: this.reelsDetailList.length * this.reelsPrice + this.feedsDetailList.length * this.feedsPrice + this.storyDetailList.length * this.storyPrice,
      reelsDetailList: this.reelsDetailList,
      storyDetailList: this.storyDetailList,
      feedsDetailList: this.feedsDetailList,
      storyPrice: this.storyPrice,
      feedsPrice: this.feedsPrice,
      reelsPrice: this.reelsPrice,
    }
    this.displayPaymentMethod = true;
  }

  checkout(method: any) {

    if (method == 'wallet') {
      // validate wallet balance
    } else if (method == 'other') {
      // STEPS

      // generate unique refnum
      let refNum = this.generateOrderReference();
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
                this.newProject.referenceNumber = refNum;
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








      // check payment status, update/create project





  }

  saveProject(statusId: any) {
    console.log(this.newProject);
    this.newProject.projectDetails = [];

    this.newProject.userId = localStorage.getItem("user_id") || '';
    this.newProject.statusId = statusId;
    this.newProject.title = this.projectTitle;
    this.newProject.description = this.projectDescription;
    this.newProject.mention = this.projectMention;
    this.newProject.caption = this.projectCaption;
    this.newProject.hashtag = this.projectHashtag;
    this.newProject.influencerId = this.selectedInfluencerId;
    this.newProject.projectDetails = this.newProject.projectDetails.concat(this.storyDetailList);
    this.newProject.projectDetails = this.newProject.projectDetails.concat(this.feedsDetailList);
    this.newProject.projectDetails = this.newProject.projectDetails.concat(this.reelsDetailList);

    if (this.draftProject ) {
      // update
      this.newProject.id = this.draftProject.id;
      console.log(this.newProject);
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

    } else if (this.influencerSelectedProject) {
      this.newProject.id = this.influencerSelectedProject.id;
      this.projectService.editProject(this.newProject).subscribe(
        (data) => {
          // console.log(data);
          this.ngZone.run(() => {
            this.router.navigate(['/project'], {state: {status: true}});
          })
          },
          (error) => {
            console.log(error);
            this.createError = true;
          }
      )
    } else {
      // create new
      this.projectService.createProject(this.newProject).subscribe(
        (data) => {
            this.router.navigate(['/project'], {state: {status: true}});
          },
          (error) => {
            console.log(error);
            this.createError = true;
          }
      )
    }
  }

  openDetail(media: string) {
    this.editDetailForm = null;
    if (media == '1') {
      this.detailHeader = 'Add Story';
      this.detailMedia = media;
      this.detailId = this.storyDetailList.length;
      this.displayDetail = true;
    } else if (media == '2') {
      this.detailHeader = 'Add Feeds';
      this.detailMedia = media;
      this.detailId = this.feedsDetailList.length;
      this.displayDetail = true;
    } else if (media == '3') {
      this.detailHeader = 'Add Reels';
      this.detailMedia = media;
      this.detailId = this.reelsDetailList.length;
      this.displayDetail = true;
    }
  }

  // for edit detail
  editDetailForm: any;

  openEditDetail(item: any) {
    // console.log(item);
    this.editDetailForm = item;
    if (item['mediatypeId'] == '1') {
      this.detailHeader = 'Edit Story';
    } else if(item['mediatypeId'] == '2') {
      this.detailHeader = 'Edit Feeds';
    } else if (item['mediatypeId'] == '3') {
      this.detailHeader = 'Edit Reels';
    }
    this.detailMedia = item['mediatypeId'];
    this.detailId = item['tempId'];
    this.displayDetail = true;
  }

  deleteDetail(item: any) {
    if (item['mediatypeId'] == '1') {
      this.storyDetailList.forEach(element => {
        if (element.tempId == item['tempId']) {
          this.storyDetailList.splice(this.storyDetailList.indexOf(element), 1);
        }
      })
    } else if (item['mediatypeId'] == '2') {
      this.feedsDetailList.forEach(element => {
        if (element.tempId == item['tempId']) {
          this.feedsDetailList.splice(this.feedsDetailList.indexOf(element), 1);
        }
      })
    } else if (item['mediatypeId'] == '3') {
      this.reelsDetailList.forEach(element => {
        if (element.tempId == item['tempId']) {
          this.reelsDetailList.splice(this.reelsDetailList.indexOf(element), 1);
        }
      })
    }
  }

  detailCancel() {
    this.displayDetail = false;
  }

  detailConfirm(form: any) {
    this.displayDetail = false;
    let newFlag = true;

    if (form['value'].media == '1') { //story
      // add new jika belum ada, update jika sudah ada
      this.storyDetailList.forEach(element => {
        if (element.tempId == form['value'].id) {
          element.deadlineDate = form['value'].date;
          element.deadlineTime = form['value'].time;
          element.note = form['value'].note;
          element.mediatypeId = form['value'].media;

          newFlag = false;
        }
      });
      if (newFlag) {
        this.addStory(form);
      }
    } else if (form['value'].media == '2') { //feeds
      // add new jika belum ada, update jika sudah ada
      this.feedsDetailList.forEach(element => {
          if (element.tempId == form['value'].id) {
            element.deadlineDate = form['value'].date;
            element.deadlineTime = form['value'].time;
            element.note = form['value'].note;
            element.mediatypeId = form['value'].media;

            newFlag = false;
          }
        });
        if (newFlag) {
          this.addFeeds(form);
        }
    } else if (form['value'].media == '3') { //reels
        // add new jika belum ada, update jika sudah ada
        this.reelsDetailList.forEach(element => {
          if (element.tempId == form['value'].id) {
            element.deadlineDate = form['value'].date;
            element.deadlineTime = form['value'].time;
            element.note = form['value'].note;
            element.mediatypeId = form['value'].media;

            newFlag = false;
          }
        });
        if (newFlag) {
          this.addReels(form);
        }
    }
  }

  addStory(form: any) {

    let newDetail = new ProjectDetail();
    newDetail.deadlineDate = form['value'].date;
    newDetail.deadlineTime = form['value'].time;
    newDetail.note = form['value'].note;
    newDetail.mediatypeId = form['value'].media;
    newDetail.tempId = form['value'].id;

    this.storyDetailList.push(newDetail);
  }

  addFeeds(form: any) {

    let newDetail = new ProjectDetail();
    newDetail.deadlineDate = form['value'].date;
    newDetail.deadlineTime = form['value'].time;
    newDetail.note = form['value'].note;
    newDetail.mediatypeId = form['value'].media;
    newDetail.tempId = form['value'].id;

    this.feedsDetailList.push(newDetail);
  }

  addReels(form: any) {

    let newDetail = new ProjectDetail();
    newDetail.deadlineDate = form['value'].date;
    newDetail.deadlineTime = form['value'].time;
    newDetail.note = form['value'].note;
    newDetail.mediatypeId = form['value'].media;
    newDetail.tempId = form['value'].id;

    this.reelsDetailList.push(newDetail);
  }

  getStoryListFromDraft(projectDetails: any[] | ProjectDetail[]):any[] {
    let storyList: ProjectDetail[] = [];
    // console.log(projectDetails);

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
        newDetail.id = element.id;

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
        newDetail.link = element.link;
        newDetail.id = element.id;

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
        newDetail.id = element.id;

        storyList.push(newDetail);
      }
    })

    return storyList;
  }


  findInfluencer() {
    // console.log(this.newProject);

    this.newProject.projectDetails = [];
    this.newProject.userId = localStorage.getItem("user_id") || '';
    this.newProject.statusId = '1';
    this.newProject.title = this.projectTitle;
    this.newProject.description = this.projectDescription;
    this.newProject.mention = this.projectMention;
    this.newProject.caption = this.projectCaption;
    this.newProject.hashtag = this.projectHashtag;
    this.newProject.influencerId = this.selectedInfluencerId;
    this.newProject.projectDetails = this.newProject.projectDetails.concat(this.storyDetailList);
    this.newProject.projectDetails = this.newProject.projectDetails.concat(this.feedsDetailList);
    this.newProject.projectDetails = this.newProject.projectDetails.concat(this.reelsDetailList);

    if (this.draftProject) {
      this.newProject.id = this.draftProject.id;
    }
    return this.router.navigate(['/influencer'], {state: {newProject: this.newProject} })
  }

  getProfilePictureUrl(profilePicture: string): string {
    return profilePicture.replace(/\\"/g, ''); // Menghapus karakter escape
  }

  paymentCancel() {
    this.displayPaymentMethod = false;
  }

  back() {

  }

  formatPrice(price: any) {
    let formatted = this.decimalPipe.transform(price, '1.0-0');
    return formatted!.replace(/,/g, '.');
  }

}
