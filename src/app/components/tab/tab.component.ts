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

  selectedId: any = '1';

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
