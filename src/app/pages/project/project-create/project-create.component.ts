import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ProjectCreate } from '../../../models/project-create';
import { ProjectDetail } from '../../../models/project-detail';
import { error, time } from 'console';
import { AlertErrorComponent } from "../../../components/alert-error/alert-error.component";
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationPopupComponent } from "../../../components/confirmation-popup/confirmation-popup.component";
import { ProjectDetailPopupComponent } from "./project-detail-popup/project-detail-popup.component";

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [HeaderComponent, RouterLink, AlertErrorComponent, CommonModule, FormsModule, ConfirmationPopupComponent, ReactiveFormsModule, ProjectDetailPopupComponent],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css'
})
export class ProjectCreateComponent implements OnInit{

  newProject: ProjectCreate = new ProjectCreate();

  // for confirmation popup
  displayConfirmation: boolean = false;
  confirmBody!: string;
  confirmHeader!: string;

  // for project detail popup
  displayDetail: boolean = false;
  detailHeader!: string;
  detailMedia!: string;
  detailId!: number;

  // for error alert
  createError: boolean = false;
  detailNotSelected: boolean = false;

  // for prices from influencer
  storyPrice?: any = '100000';
  feedsPrice?: any = '200000';
  reelsPrice?: any = '300000';

  selectedInfluencer?: any = null;

  ngOnInit(): void {

  }

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private fb: FormBuilder
  ) { }

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

  confirmConfirm() {
    if (this.confirmHeader == 'Go to payment') {
      this.goToPayment();
    } else {
      this.saveToDraft();
    }
  }

  confirmCancel() {
    this.displayConfirmation = false;
  }


  goToPayment() {
    if (this.storyDetailList.length == 0 && this.feedsDetailList.length == 0 && this.reelsDetailList.length == 0) {
      this.detailNotSelected = true;
    } else {
      this.newProject.title = this.projectTitle;
      this.newProject.description = this.projectDescription;
      this.newProject.mention = this.projectMention;
      this.newProject.caption = this.projectCaption;
      this.newProject.hashtag = this.projectHashtag;
      this.newProject.projectDetails = this.storyDetailList;
      this.newProject.projectDetails = this.feedsDetailList;
      this.newProject.projectDetails = this.reelsDetailList;

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

  saveToDraft() {

    this.newProject.projectDetails = [];

    this.newProject.userId = localStorage.getItem("user_id") || '';
    this.newProject.statusId = '1';
    // this.newProject.influencerId = this.selectedInfluencer.;
    this.newProject.title = this.projectTitle;
      this.newProject.description = this.projectDescription;
      this.newProject.mention = this.projectMention;
      this.newProject.caption = this.projectCaption;
      this.newProject.hashtag = this.projectHashtag;
      this.newProject.projectDetails = this.newProject.projectDetails.concat(this.storyDetailList);
      this.newProject.projectDetails = this.newProject.projectDetails.concat(this.feedsDetailList);
      this.newProject.projectDetails = this.newProject.projectDetails.concat(this.reelsDetailList);

    console.log(this.newProject);
    console.log(this.storyDetailList);

      this.projectService.createProject(this.newProject).subscribe(
        (data) => {
          console.log(data);
            this.router.navigate(['/project/status/1'], {state: {status: true}});
          },
          (error) => {
            console.log(error);
            this.createError = true;
          }
      )

  }

  askConfirm(id: number) {
    if (id == 1) {
      this.confirmHeader = "Save to draft";
      this.confirmBody = "Are you sure want to save this?"
      this.displayConfirmation = true;
    } else if (id == 2) {
      this.confirmHeader = "Go to payment";
      this.confirmBody = "Are you sure want to go to payment?"
      this.displayConfirmation = true;
    }
  }

  openDetail(media: string) {
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
    console.log(item);
    this.editDetailForm = item;
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


  findInfluencer() {

  }

}
