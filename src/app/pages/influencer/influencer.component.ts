import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { InfluencerCardComponent } from "../../components/influencer-card/influencer-card.component";
import { TabComponent } from "../../components/tab/tab.component";
import { RangeFilterComponent } from "../../components/range-filter/range-filter.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-influencer',
  standalone: true,
  imports: [HeaderComponent, InfluencerCardComponent, TabComponent, RangeFilterComponent, CommonModule, FormsModule],
  templateUrl: './influencer.component.html',
  styleUrl: './influencer.component.css'
})
export class InfluencerComponent {
  followerRanges = ['1k-10k', '10k-50k', '50k-100k', '100k+'];

  selectedFilters = {
    followers: [] as string[] // Array untuk multiple select
    // locations: [] as string[],
    // age: { min: null, max: null }
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  // Toggle filter aktif atau tidak
  toggleFilter(type: string, value: string): void {
    if (type === 'followers') {
      const index = this.selectedFilters.followers.indexOf(value);
      if (index > -1) {
        // Jika sudah ada, hapus
        this.selectedFilters.followers.splice(index, 1);
      } else {
        // Jika belum ada, tambahkan
        this.selectedFilters.followers.push(value);
      }
      this.cdr.detectChanges();
    }
    console.log("Updated Filters:", this.selectedFilters);
    // else if (type === 'locations') {
    //   this.updateArray(this.selectedFilters.locations, value);
    // }
  }

  // Cek apakah filter aktif
  isFilterActive(type: string, value: string): boolean {
    if (type === 'followers') {
      return this.selectedFilters.followers.includes(value);
    }
    // else if (type === 'locations') {
    //   return this.selectedFilters.locations.includes(value);
    // }
    return false;
  }

}


