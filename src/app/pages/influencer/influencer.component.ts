import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { InfluencerCardComponent } from "../../components/influencer-card/influencer-card.component";
import { TabComponent } from "../../components/tab/tab.component";
import { RangeFilterComponent } from "../../components/range-filter/range-filter.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgeService } from '../../services/age.service';
import { GenderService } from '../../services/gender.service';
import { MediaTypeService } from '../../services/media-type.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-influencer',
  standalone: true,
  imports: [HeaderComponent, InfluencerCardComponent, TabComponent, RangeFilterComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './influencer.component.html',
  styleUrl: './influencer.component.css'
})
export class InfluencerComponent implements OnInit{
  ngOnInit(): void {
    this.locationService.getAllLocations().subscribe(
      (data) => {
        this.locations = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.mediaTypeService.getAllMediaType().subscribe(
      (data) => {
        this.mediaTypes = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.ageService.getAllAgeRange().subscribe(
      (data) => {
        this.ageAudiences = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.genderService.getAllGender().subscribe(
      (data) => {
        this.genderAudiences = data;
        this.genders = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // followerRanges = [
  //   { label: '1k-10k', value: { min: 1000, max: 10000 } },
  //   { label: '10k-100k', value: { min: 10000, max: 100000 } },
  //   { label: '100k-500k', value: { min: 100000, max: 500000 } },
  //   { label: '500k-1000k', value: { min: 500000, max: 1000000 } },
  //   { label: '> 1000k', value: { min: 1000000, max: null } }
  // ];
  followerRanges = ['1k - 10k', '10k - 100k', '100k - 500k', '500k - 1000k', '> 1000k'];
  mediaTypes!: any[];
  engagements = ['Low', 'Average', 'High'];
  genders!: any[];
  ages = ['13 - 17', '18 - 35', '36 - 50', '> 50'];
  prices = ['< 200k', '200k - 500k', '500k - 1000k', '> 1000k'];
  ratings = ['5 star', '4 star', '3 star', '2 star', '1 star'];
  locations!: any[];
  genderAudiences!: any[];
  ageAudiences!: any[];

  selectedFilters = {
    followers: [] as string[],
    media: [] as string[],
    engagement: [] as string[],
    gender: [] as string[],
    age: [] as string[],
    price: [] as string[],
    rating: [] as string[],
    genderAudience: [] as string[],
    ageAudience: [] as string[]
  };

  constructor(private cdr: ChangeDetectorRef, private ageService: AgeService, private genderService: GenderService, private mediaTypeService: MediaTypeService, private locationService: LocationService) {}

  // Toggle filter aktif atau tidak
  toggleFilter(type: string, value: string): void {
    if (type === 'followers') {
      if (this.isUsingRangeFilter) {
        this.minFollowers = null;
        this.maxFollowers = null;
        // Nonaktifkan custom input range
        this.isUsingRangeFilter = false;
        // Reset array
        this.selectedFilters.followers = [];
      }
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
    else if (type === 'media') {
      const index = this.selectedFilters.media.indexOf(value);
      if (index > -1) {
        this.selectedFilters.media.splice(index, 1);
      } else {
        this.selectedFilters.media.push(value);
      }
      this.cdr.detectChanges();
    }
    else if (type === 'engagement') {
      const index = this.selectedFilters.engagement.indexOf(value);
      if (index > -1) {
        this.selectedFilters.engagement.splice(index, 1);
      } else {
        this.selectedFilters.engagement.push(value);
      }
      this.cdr.detectChanges();
    }
    else if (type === 'gender') {
      const index = this.selectedFilters.gender.indexOf(value);
      if (index > -1) {
        this.selectedFilters.gender.splice(index, 1);
      } else {
        this.selectedFilters.gender.push(value);
      }
      this.cdr.detectChanges();
    }
    else if (type === 'age') {
      if (this.isUsingRangeFilter) {
        this.minAge = null;
        this.maxAge = null;
        // Nonaktifkan custom input range
        this.isUsingRangeFilter = false;
        // Reset array
        this.selectedFilters.age = [];
      }
      const index = this.selectedFilters.age.indexOf(value);
      if (index > -1) {
        this.selectedFilters.age.splice(index, 1);
      } else {
        this.selectedFilters.age.push(value);
      }
      this.cdr.detectChanges();
    }
    else if (type === 'price') {
      if (this.isUsingRangeFilter) {
        this.minPrice = null;
        this.maxPrice = null;
        // Nonaktifkan custom input range
        this.isUsingRangeFilter = false;
        // Reset array
        this.selectedFilters.price = [];
      }
      const index = this.selectedFilters.price.indexOf(value);
      if (index > -1) {
        this.selectedFilters.price.splice(index, 1);
      } else {
        this.selectedFilters.price.push(value);
      }
      this.cdr.detectChanges();
    }
    else if (type === 'rating') {
      const index = this.selectedFilters.rating.indexOf(value);
      if (index > -1) {
        this.selectedFilters.rating.splice(index, 1);
      } else {
        this.selectedFilters.rating.push(value);
      }
      this.cdr.detectChanges();
    }
    else if (type === 'genderAudience') {
      const index = this.selectedFilters.genderAudience.indexOf(value);
      if (index > -1) {
        this.selectedFilters.genderAudience.splice(index, 1);
      } else {
        this.selectedFilters.genderAudience.push(value);
      }
      this.cdr.detectChanges();
    }
    else if (type === 'ageAudience') {
      if (this.isUsingRangeFilter) {
        this.minAgeAudience = null;
        this.maxAgeAudience = null;
        // Nonaktifkan custom input range
        this.isUsingRangeFilter = false;
        // Reset array
        this.selectedFilters.ageAudience = [];
      }
      const index = this.selectedFilters.ageAudience.indexOf(value);
      if (index > -1) {
        this.selectedFilters.ageAudience.splice(index, 1);
      } else {
        this.selectedFilters.ageAudience.push(value);
      }
      this.cdr.detectChanges();
    }
    console.log("Updated Filters:", this.selectedFilters);

  }

  // Cek apakah filter aktif
  isFilterActive(type: string, value: string): boolean {
    if (type === 'followers') {
      return this.selectedFilters.followers.includes(value);
    }
    if (type === 'media') {
      return this.selectedFilters.media.includes(value);
    }
    else if (type === 'engagement') {
      return this.selectedFilters.engagement.includes(value);
    }
    else if (type === 'gender') {
      return this.selectedFilters.gender.includes(value);
    }
    else if (type === 'age') {
      return this.selectedFilters.age.includes(value);
    }
    else if (type === 'price') {
      return this.selectedFilters.price.includes(value);
    }
    else if (type === 'rating') {
      return this.selectedFilters.rating.includes(value);
    }
    else if (type === 'genderAudience') {
      return this.selectedFilters.genderAudience.includes(value);
    }
    else if (type === 'ageAudience') {
      return this.selectedFilters.ageAudience.includes(value);
    }
    return false;
  }

  // Untuk bagian range
  isUsingRangeFilter = false;  // To toggle between range filter and predefined select
  minFollowers: number | null = null;
  maxFollowers: number | null = null;
  minAge: number | null = null;
  maxAge: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minAgeAudience: number | null = null;
  maxAgeAudience: number | null = null;

  // Handle input change in range filter
  onRangeInputChange(type: string) {
    if (type === 'follower') {
      if (this.minFollowers !== null || this.maxFollowers !== null) {
        this.isUsingRangeFilter = true;
        // Reset selected filters when using custom range
        this.selectedFilters.followers = [];
        // Menambahkan range kustom yang sudah dikonversi ke dalam array followers
        const customRange = this.convertToArray(this.minFollowers ?? 0, this.maxFollowers ?? 0);
        this.selectedFilters.followers.push(customRange);
      } else {
        this.isUsingRangeFilter = false;
      }
    }
    else if (type === 'age') {
      if (this.minAge !== null || this.maxAge !== null) {
        this.isUsingRangeFilter = true;
        // Reset selected filters when using custom range
        this.selectedFilters.age = [];
        // Menambahkan range kustom yang sudah dikonversi ke dalam array age
        const customRange = this.convertToArrayAge(this.minAge ?? 0, this.maxAge ?? 0);
        this.selectedFilters.age.push(customRange);
      } else {
        this.isUsingRangeFilter = false;
      }
    }
    else if (type === 'price') {
      if (this.minPrice !== null || this.maxPrice !== null) {
        this.isUsingRangeFilter = true;
        // Reset selected filters when using custom range
        this.selectedFilters.price = [];
        // Menambahkan range kustom yang sudah dikonversi ke dalam array price
        const customRange = this.convertToArray(this.minPrice ?? 0, this.maxPrice ?? 0);
        this.selectedFilters.price.push(customRange);
      } else {
        this.isUsingRangeFilter = false;
      }
    }
    else if (type === 'ageAudience') {
      if (this.minAgeAudience !== null || this.maxAgeAudience !== null) {
        this.isUsingRangeFilter = true;
        // Reset selected filters when using custom range
        this.selectedFilters.ageAudience = [];
        // Menambahkan range kustom yang sudah dikonversi ke dalam array age
        const customRange = this.convertToArrayAge(this.minAgeAudience ?? 0, this.maxAgeAudience ?? 0);
        this.selectedFilters.ageAudience.push(customRange);
      } else {
        this.isUsingRangeFilter = false;
      }
    }
    console.log("Updated Filters:", this.selectedFilters);

  }

  // Fungsi untuk mengonversi min/max followers menjadi format 'k'
  convertToArray(min: number, max: number): string {
    const convertToK = (num: number): string => {
      if (num >= 1000000) return `${num / 1000000}M`; // Jika lebih dari 1 juta
      if (num >= 1000) return `${num / 1000}k`; // Jika lebih dari 1000
      return `${num}`; // Jika kurang dari 1000
    };

    const minConverted = convertToK(min);
    const maxConverted = convertToK(max);

    return `${minConverted} - ${maxConverted}`;
  }

  // Fungsi untuk mengonversi min/max followers menjadi format 'k'
  convertToArrayAge(min: number, max: number): string {
    const convertToK = (num: number): string => {
      return `${num}`;
    };

    const minConverted = convertToK(min);
    const maxConverted = convertToK(max);

    return `${minConverted} - ${maxConverted}`;
  }



}


