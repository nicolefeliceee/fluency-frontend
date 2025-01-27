import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, output, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { emit } from 'process';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent implements OnInit{

  @Input() options!: any[];
  @Input() paramName!: any;

  @Input() selectedId: any;
  instagramId: any;

  id = output<any>();

  opentab(id: any) {
    this.selectedId = id;
    this.id.emit(id);
  }

  ngOnInit(): void {
    this.instagramId = localStorage.getItem("instagram_id");
  }


}
