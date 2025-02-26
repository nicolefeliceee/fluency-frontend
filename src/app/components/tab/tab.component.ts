import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { emit } from 'process';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent implements OnInit{

  @Input() options!: any[];
  @Input() paramName!: any;

  @Input() selectedId: any;
  @Input() influencerId: any;
  instagramId: any;

  id = output<any>();
  outputQuery = output<any>();

  constructor(
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
  }

  opentab(id: any) {
    this.selectedId = id;
    this.id.emit(id);
  }

  ngOnInit(): void {
    this.instagramId = localStorage.getItem("instagram_id");
  }

  searchQuery: any;

  search() {
    // console.log(this.searchQuery);
    this.outputQuery.emit(this.searchQuery);
  }

  addNewProject() {
    if (this.influencerId) {
      this.router.navigate(['project/create'], {state: {influencerId: this.influencerId}});
    } else {
      this.router.navigate(['project/create']);
    }
  }

}
