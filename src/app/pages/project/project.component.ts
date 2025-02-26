import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { TabComponent } from "../../components/tab/tab.component";
import { StatusService } from '../../services/status.service';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from "./project-card/project-card.component";
import { Router, RouterLink } from '@angular/router';
import { ProjectCreate } from '../../models/project-create';
import { AlertSuccessComponent } from "../../components/alert-success/alert-success.component";
import { LoadingService } from '../../services/loading.service';
import { ConfirmationPopupComponent } from "../../components/confirmation-popup/confirmation-popup.component";
import { error } from 'console';
import { AlertErrorComponent } from "../../components/alert-error/alert-error.component";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [HeaderComponent, TabComponent, CommonModule, ProjectCardComponent, RouterLink, AlertSuccessComponent, ConfirmationPopupComponent, AlertErrorComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit, OnChanges {

  generalError: boolean = false;

  // for checking usertype
  instagramId: any;

  // influencerId
  influencerId!: any;

  statusOptions: any[] = [];
  projectList!: ProjectCreate[];
  selectedStatus: any;
  expectedStatus: any;

  createSuccess: boolean = false;

  displayConfirmation: boolean = false;
  confirmHeader: string = "";
  confirmBody: string = "";

  constructor(
    private statusService: StatusService,
    private projectService: ProjectService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.createSuccess = navigation?.extras.state?.['status'];
    this.influencerId = navigation?.extras.state?.['influencerId'];
    this.expectedStatus = navigation?.extras.state?.['expectedStatus'];
  };

  loadData() {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    // this.loadData();

    this.instagramId = localStorage.getItem('instagram_id');

    if (this.instagramId != null) {
      this.selectedStatus = '3';
    } else {
      this.selectedStatus = '1';
    }

    if (this.expectedStatus) {
      this.selectedStatus = this.expectedStatus;
    }



    this.statusService.getAllStatus().subscribe(
      (data) => {
        for (let i = 0; i < data.length; i++) {
          if (localStorage.getItem('instagram_id') != null && data[i]['for_influencer']) {
            this.statusOptions.push(data[i]);
          }
          if (localStorage.getItem('instagram_id') == null) {
            this.statusOptions.push(data[i]);
          }
        }

      },
      (error) => {
        console.log(error);
      }
    )

    this.projectService.getProjects(this.selectedStatus, localStorage.getItem("user_id") || '', null).subscribe(
      (data) => {
        this.projectList = data;
      }
    )

    setTimeout(() => {
      this.createSuccess = false;
    }, 3000)

  }

  getProjectsByStatus(id: any) {
    this.loadData();
    this.selectedStatus = id;
    this.projectService.getProjects(id, localStorage.getItem("user_id") || '', null).subscribe(
      (data) => {
        this.projectList = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }


  openIndex: number | null = null;

  toggleButton(index: number) {
    if (this.openIndex == index) {
      this.openIndex = null;
    } else {
      this.openIndex = index;
    }
  }

  toDelete: any;
  deleteSuccess: boolean = false;

  deleteItem(item: any) {
    this.toDelete = item;
    this.displayConfirmation = true;
    this.confirmHeader = "Delete project "+ item['title']||'' +"?";
    this.confirmBody = "This project will be deleted permanently";
  }

  confirmConfirm() {
    this.projectService.deleteProjectbyId(this.toDelete['id']).subscribe(
      (data) => {
        this.deleteSuccess = true;
        this.displayConfirmation = false;
        this.projectList.splice(this.projectList.indexOf(this.toDelete), 1);
        setTimeout(() => {
          this.deleteSuccess = false;
        }, 2000);
      },
      (error) => {
        this.generalError = true;
      }
    )
  }

  confirmCancel() {
    this.displayConfirmation = false;
  }



  reportProject(item: any) {

  }


  // Detects clicks outside the component
  @HostListener('document:click', ['$event'])
  handleClickOutsideToggleButton(event: Event) {
    const targetElement = event.target as HTMLElement;

    // If click is inside a dropdown button or menu, do nothing
    if (targetElement.closest('.toggleButton')) {
      return;
    }

    // If click is outside, close the dropdown
    this.openIndex = null;
  }

  search(query: string) {
    if (query.length>0) {
      this.projectService.getProjects(null, localStorage.getItem('user_id') || '', query).subscribe(
        data => {
          this.projectList = data;
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.projectService.getProjects(this.selectedStatus, localStorage.getItem('user_id') || '', null).subscribe(
        data => {
          this.projectList = data;
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  influencerAlreadySelected: boolean = false;

  addNewProject() {
    if (this.influencerId) {
      this.router.navigate(['project/create'], {state: {influencerId: this.influencerId}});
    } else {
      this.router.navigate(['project/create']);
    }
  }

}
