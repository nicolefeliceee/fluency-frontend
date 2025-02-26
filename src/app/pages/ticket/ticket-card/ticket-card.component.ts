import { Component, Input, output } from '@angular/core';
import { Router } from '@angular/router';
import { InstagramService } from '../../../services/instagram.service';
import { InfluencerService } from '../../../services/influencer.service';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.css'
})
export class TicketCardComponent {

    brandName?: string;
    @Input() title?: string;
    @Input() index?: number;
    indexClick = output<any>();

    @Input() ticket!: any;
    @Input() project!: any;
    @Input() projectDetails!: any[];
  @Input() mediaTypeUnique?: string[];

  @Input() status!: any[];

    constructor(
      private router: Router,
      private brandService: BrandService
  ) { }

  username?: string;
  follower?: number;
  profilePic?: string;

  ngOnInit(): void {
    console.log(this.ticket);
    this.project = this.ticket['project_header'];
    this.projectDetails = this.project['project_details'];

    this.brandService.getBrandById(this.project['brand_id']).subscribe(
      data => {
        this.brandName = data['name'];
      }
    )
  }

  viewProjectDetail(ticket: any) {
    this.router.navigate(['/ticket/detail'], { state: { ticketId: ticket['id'] } });
  }


  toggleButton() {
    this.indexClick.emit(this.index);
  }

}
