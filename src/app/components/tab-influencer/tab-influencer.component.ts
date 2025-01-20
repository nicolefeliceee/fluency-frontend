import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, output, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { emit } from 'process';

@Component({
  selector: 'app-tab-influencer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tab-influencer.component.html',
  styleUrl: './tab-influencer.component.css'
})
export class TabInfluencerComponent implements OnInit, OnChanges{

  ngOnChanges(changes: SimpleChanges): void {
    console.log("berubahhh");
    if(this.isAll) {
      console.log("isAll: " + this.isAll);
      this.selectedId = '0';
      this.id.emit('0');
    }
  }

  @Input() options!: any[];
  @Input() paramName!: any;
  @Input() isAll!: boolean;

  selectedId: any = '0';

  // if (isAll == true) {
  //   this.selectedId = 0;
  // }

  id = output<any>();

  opentab(id: any) {
    console.log(id);
    this.selectedId = id;
    console.log(this.selectedId);
    console.log(this.selectedId == id);
    this.id.emit(id);
  }

  ngOnInit(): void {
    console.log(this.options);
  }

}
