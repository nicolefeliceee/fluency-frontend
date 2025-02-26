import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './tab-admin.component.html',
  styleUrl: './tab-admin.component.css'
})
export class TabAdminComponent {

   @Input() options!: any[];
    @Input() paramName!: any;

    @Input() selectedStatus: any;

    status = output<any>();
    outputQuery = output<any>();

    constructor(
      private router: Router
    ) {
      const navigation = this.router.getCurrentNavigation();
    }

    opentab(status: any) {
      this.selectedStatus = status;
      this.status.emit(status);
    }

    searchQuery: any;

    search() {
      // console.log(this.searchQuery);
      this.outputQuery.emit(this.searchQuery);
    }

}
