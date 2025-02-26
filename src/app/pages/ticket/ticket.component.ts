import { Component, OnInit } from '@angular/core';
import { TabAdminComponent } from "./tab-admin/tab-admin.component";
import { ProjectService } from '../../services/project.service';
import { LoadingService } from '../../services/loading.service';
import { Router } from '@angular/router';
import exp from 'constants';
import { CommonModule } from '@angular/common';
import { ConfirmationPopupComponent } from "../../components/confirmation-popup/confirmation-popup.component";
import { AlertErrorComponent } from "../../components/alert-error/alert-error.component";
import { TicketCardComponent } from "./ticket-card/ticket-card.component";
import { HttpErrorResponse } from '@angular/common/http';
import { AlertSuccessComponent } from "../../components/alert-success/alert-success.component";

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [TabAdminComponent, CommonModule, ConfirmationPopupComponent, AlertErrorComponent, TicketCardComponent, AlertSuccessComponent],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit{

  // list error
  generalError: boolean = false;
  resolveSuccess: boolean = false;

  statusOptions: any[] = ['Ongoing', 'Resolved'];

  selectedStatus: any;
  expectedStatus: any;

  displayConfirmation: boolean = false;
  confirmHeader: string = "";
  confirmBody: string = "";

  // ticket
  ticketList: any[] = [];

  constructor(
      private projectService: ProjectService,
      private router: Router,
      private loadingService: LoadingService
    ) {
      const navigation = this.router.getCurrentNavigation();
      this.expectedStatus = navigation?.extras.state?.['expectedStatus'];
      this.resolveSuccess = navigation?.extras.state?.['resolveSuccess'];
  };


  ngOnInit(): void {

    setTimeout(() => {
      this.resolveSuccess = false;
    }, 2000);

    this.selectedStatus = 'Ongoing';
    if (this.expectedStatus) {
      this.selectedStatus = this.expectedStatus;
    }

    this.projectService.getTickets(this.selectedStatus, null).subscribe(
      (data) => {
        console.log(data)
        this.ticketList = data;
      }
    )
  }

  confirmConfirm() {

  }

  confirmCancel() {

  }

  getTicketsByStatus(status: any) {
    this.selectedStatus = status;
    this.projectService.getTickets(status, null).subscribe(
      (data) => {
        console.log(data);
        this.ticketList = data;
      },
      (error) => {
        if (error.status == 404) {
          this.ticketList = [];
        }
      }
    )
  }

  search(query: string) {
    if (query.length>0) {
      this.projectService.getTickets(null, query).subscribe(
        data => {
          this.ticketList = data;
        },
        error => {
          if (error.status == 404) {
            this.ticketList = [];
          }
        }
      )
    } else {
      this.projectService.getTickets(this.selectedStatus, null).subscribe(
        data => {
          this.ticketList = data;
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  openIndex: number | null = null;
  toggleButton(index: number) {
    if (this.openIndex == index) {
      this.openIndex = null;
    } else {
      this.openIndex = index;
    }
  }

}
