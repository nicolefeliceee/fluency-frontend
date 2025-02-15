import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  instagramId: any;

  id = output<any>();
  outputQuery = output<any>();

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


}
