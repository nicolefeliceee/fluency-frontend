import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { InfluencerCardComponent } from "../../components/influencer-card/influencer-card.component";
import { TabComponent } from "../../components/tab/tab.component";
import { RangeFilterComponent } from "../../components/range-filter/range-filter.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AgeService } from '../../services/age.service';
import { GenderService } from '../../services/gender.service';
import { MediaTypeService } from '../../services/media-type.service';
import { LocationService } from '../../services/location.service';
import { InfluencerService } from '../../services/influencer.service';
import { HostListener } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { TabInfluencerComponent } from "../../components/tab-influencer/tab-influencer.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupComponent } from "../../components/confirmation-popup/confirmation-popup.component";

interface Category {
  id: number; // ID kategori
  label: string; // Nama kategori
}

interface Influencer {
  id: number; // ID dari user (integer)
  name: string; // Nama user
  email: string; // Email user
  location: string; // Label lokasi
  phone: string; // Nomor telepon
  gender: string; // Gender label
  dob: string; // Tanggal lahir (string, dalam format ISO/Date)
  feedsprice: string; // Harga feed
  reelsprice: string; // Harga reels
  storyprice: string; // Harga story
  category: Category[];
  usertype: string; // Tipe user
  instagramid: string; // ID Instagram
  isactive: boolean; // Status aktif
  token: string; // Token
  followers: string;
  rating: number;
  totalreview: string;
  minprice: string;
  profilepicture: string;
}

@Component({
  selector: 'app-influencer',
  standalone: true,
  imports: [HeaderComponent, InfluencerCardComponent, TabComponent, RangeFilterComponent, CommonModule, FormsModule, ReactiveFormsModule, TabInfluencerComponent, ConfirmationPopupComponent],
  templateUrl: './influencer.component.html',
  styleUrl: './influencer.component.css'
})
export class InfluencerComponent implements OnInit{
  constructor(
    private cdr: ChangeDetectorRef,
    private ageService: AgeService,
    private genderService: GenderService,
    private mediaTypeService: MediaTypeService,
    private locationService: LocationService,
    private fb: FormBuilder,
    private influencerService: InfluencerService,
    private categoryService: CategoryService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.newProject = navigation?.extras.state?.['newProject'];
  }

  askConfirm() {

  }

  // for hire

  askConfirmHireInfluencer: boolean = false;
  influencerIdToHire: any;

  confirmHireInfluencer(influencerId: any) {
    this.influencerIdToHire = influencerId;
    this.askConfirmHireInfluencer = true;
  }

  newProject: any;
  redirectToProject() {
    // jika sebelumnya tekan button find dari menu create project
    if (this.newProject) {
      this.newProject.influencerId = this.influencerIdToHire;
      this.router.navigate(['project/create'], { state: { newProject: this.newProject } });
    } else { //jika mau hire dari menu influencer langsung
      this.router.navigate(['project'], { state: { influencerId: this.influencerIdToHire } });
    }
  }

  filterForm!: FormGroup;

  categoryOptions!: any[];
  selectedCategory: any = "1";
  influencer: Influencer[] = []; // Tipe array Influencer
  influencer2: Influencer[] = []; // Tipe array Influencer

  selectedFilters2 = {
    followers2: [] as string[],
    media2: [] as string[],
    // engagement: [] as string[],
    gender2: [] as string[],
    age2: [] as string[],
    price2: [] as string[],
    rating2: [] as string[],
    location2: [] as string[],
    genderAudience2: [] as string[],
    ageAudience2: [] as string[],
    sort: [] as number[],
    categoryChosen2: [] as number[]
    // locationAudience: [] as string[]
  };

  selectedFilters3 = {
    followers2: [] as string[],
    media2: [] as string[],
    // engagement: [] as string[],
    gender2: [] as string[],
    age2: [] as string[],
    price2: [] as string[],
    rating2: [] as string[],
    location2: [] as string[],
    genderAudience2: [] as string[],
    ageAudience2: [] as string[],
    sort: [1] as number[],
    categoryChosen2: [0] as number[]
    // locationAudience: [] as string[]
  };


  selectedCategoryId: number | null = null;

  ngOnInit(): void {
    // this.loadInfluencers();
    this.initializeForm();
    this.checkUserType();

    this.actRoute.queryParams.subscribe((params) => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.selectedId = +categoryId;
        this.getInfluencerCategory(Number(categoryId));
      }
      // if (params['categoryId']) {
      //   this.selectedCategoryId = +params['categoryId']; // Convert ke number
      //   this.getInfluencerCategory(this.selectedCategoryId);
      // }
      else{
        // Send sort value to backend
        this.influencerService.sendSortOption(this.selectedFilters3).subscribe(
          (response) => {
            this.influencer = response;
            this.influencer2 = response;
            console.log('Init sent successfully:', this.influencer);
          },
          (error) => {
            console.error('Error sending sort option:', error);
          }
        );
      }
    });

    // ini untuk tab
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        console.log(data);
        // this.categoryOptions = data;
        this.categoryOptions = [{ active_logo: null, logo: null, id: '0', label: 'All' }, ...data];
        console.log(this.categoryOptions)
      },
      (error) => {
        console.log(error);
      }
    )

    this.locationService.getAllLocations().subscribe(
      (data) => {
        this.locations = data;
        // this.locationAudiences = data;
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

  initializeForm(): void {
    this.filterForm = this.fb.group({
      // multiple select influencer
      followers: [[]],
      media: [[]],
      // engagement: [[]],
      gender: [[]],
      age: [[]],
      price: [[]],
      rating: [[]],
      location: [[]],

      // multiple select audience
      genderAudience: [[]],
      ageAudience: [[]],
      // locationAudience: [[]],

      // customize range
      minFollowers: [null],
      maxFollowers: [null],
      minAge: [null],
      maxAge: [null],
      minPrice: [null],
      maxPrice: [null],
      minAgeAudience: [null],
      maxAgeAudience: [null]
    });
  }

  // Validasi dan validasi kondisi (check range) di sini
  get checkRange() {
    return this.filterForm.controls;
  }

  followerRanges = ['1k - 10k', '10k - 100k', '100k - 500k', '500k - 1000k', '> 1000k'];
  mediaTypes!: any[];
  // engagements = ['Low', 'Average', 'High'];
  genders!: any[];
  ages = ['13 - 17', '18 - 35', '36 - 50', '> 50'];
  prices = ['< 200k', '200k - 500k', '500k - 1000k', '> 1000k'];
  ratings = ['5 star', '4 star', '3 star', '2 star', '1 star'];
  locations!: any[];
  genderAudiences!: any[];
  ageAudiences!: any[];
  // locationAudiences!: any[];

  selectedFilters = {
    followers: [] as string[],
    media: [] as string[],
    // engagement: [] as string[],
    gender: [] as string[],
    age: [] as string[],
    price: [] as string[],
    rating: [] as string[],
    location: [] as string[],
    genderAudience: [] as string[],
    ageAudience: [] as string[],
    categoryChosen: [] as number[]
    // locationAudience: [] as string[]
  };

  isAllBoolean: boolean = false;
  isInfluencer!: boolean;

  checkUserType() {
    const instagramId = localStorage.getItem('instagram_id');
    this.isInfluencer = instagramId ? true : false;
    console.log("isinfluencer? " + this.isInfluencer);
  }

  resetForm(){
    this.isAllBoolean = true;
    const selectLoc = document.querySelector('#selectLocation') as HTMLSelectElement;
    const select = window.HSSelect.getInstance(selectLoc);
    // const selectLocAud = document.querySelector('#selectLocationAudience') as HTMLSelectElement;
    // const selectLA = window.HSSelect.getInstance(selectLocAud);
    this.filterForm.reset({
      isUsingRangeFilter: false,
      minFollowers: null,
      maxFollowers: null,
      minAge: null,
      maxAge: null,
      minPrice: null,
      maxPrice: null,
      minAgeAudience: null,
      maxAgeAudience: null,
      location: null,
      // locationAudience: null
    });
    this.selectedFilters = {
      followers: [],
      media: [],
      // engagement: [],
      gender: [],
      age: [],
      price: [],
      rating: [],
      location: [],
      genderAudience: [],
      ageAudience: [],
      categoryChosen: []
      // locationAudience: []
    };

    if(select != null){
      select.setValue([]);
    }
    // selectLA.setValue([]);
    this.isUsingRangeFilter = false;
    this.isInvalidRangeFoll = false;
    this.isInvalidRangeAge = false;
    this.isInvalidRangePrice = false;
    this.isInvalidRangeAgeAudience = false;
    console.log("INI DI RESET FORM" + this.selectedFilters);

    // this.loadInfluencers();
    this.initializeForm();

    // Send sort value to backend
    this.influencerService.sendSortOption(this.selectedFilters3).subscribe(
      (response) => {
        this.influencer = response;
        this.influencer2 = response;
        console.log('Init sent successfully:', this.influencer);
      },
      (error) => {
        console.error('Error sending sort option:', error);
      }
    );
  }

  updateInfluencers(searchResults: Influencer[] | null) {
    console.log ("search result: ", searchResults ? searchResults.length : null);

    if (searchResults == null){
      this.influencerService.sendSortOption(this.selectedFilters3).subscribe(
        (response) => {
          this.influencer = response;
          this.influencer2 = response;
          console.log('Init sent successfully:', this.influencer);
        },
        (error) => {
          console.error('Error sending sort option:', error);
        }
      );
    }
    else if (searchResults.length > 0) {
      this.influencer = searchResults; // Gunakan hasil pencarian
    }
    else {
      console.log("ini kosong");
      this.influencer = [];
    }
  }

  // Toggle filter aktif atau tidak
  toggleFilter(type: string, value: string): void {
    if (type === 'followers') {
      if (this.isUsingRangeFilter) {
        this.filterForm.patchValue({
          minFollowers: null,
          maxFollowers: null
        });
        // Nonaktifkan custom input range
        this.isUsingRangeFilter = false;
        this.isInvalidRangeFoll = false;
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
        this.filterForm.patchValue({
          minAge: null,
          maxAge: null
        });
        // Nonaktifkan custom input range
        this.isUsingRangeFilter = false;
        this.isInvalidRangeAge = false;
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
        this.filterForm.patchValue({
          minPrice: null,
          maxPrice: null
        });
        // Nonaktifkan custom input range
        this.isUsingRangeFilter = false;
        this.isInvalidRangePrice = false;
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
        this.filterForm.patchValue({
          minAgeAudience: null,
          maxAgeAudience: null
        });
        // Nonaktifkan custom input range
        this.isUsingRangeFilter = false;
        this.isInvalidRangeAgeAudience = false;
        // Reset array
        this.selectedFilters.ageAudience = [];
      }
      const index = this.selectedFilters.ageAudience.indexOf(value);
      // console.log(value);
      // console.log(index);
      if (index > -1) {
        this.selectedFilters.ageAudience.splice(index, 1);
      } else {
        this.selectedFilters.ageAudience.push(value);
      }
      this.cdr.detectChanges();
    }
    console.log("Updated Filters:", this.selectedFilters);
    console.log("Ini selected filter2:", this.selectedFilters2);

  }

  // Cek apakah filter aktif
  isFilterActive(type: string, value: string): boolean {
    if (type === 'followers') {
      return this.selectedFilters.followers.includes(value);
    }
    if (type === 'media') {
      return this.selectedFilters.media.includes(value);
    }
    // else if (type === 'engagement') {
    //   return this.selectedFilters.engagement.includes(value);
    // }
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
  isInvalidRangeFoll = false;  // To toggle between range filter and predefined select
  isInvalidRangeAge = false;  // To toggle between range filter and predefined select
  isInvalidRangePrice = false;  // To toggle between range filter and predefined select
  isInvalidRangeAgeAudience = false;  // To toggle between range filter and predefined select

  // Handle input change in range filter
  onRangeInputChange(type: string) {
    if (type === 'follower') {
      const minFollowers = this.filterForm.get('minFollowers')?.value;
      const maxFollowers = this.filterForm.get('maxFollowers')?.value;
      if (minFollowers !== null || maxFollowers !== null) {
        if (minFollowers !== null && maxFollowers !== null){
          if(maxFollowers >= minFollowers){
            this.isInvalidRangeFoll = false;
          }else{
            this.isInvalidRangeFoll = true;
          }
        }
        this.isUsingRangeFilter = true;
        // Reset selected filters when using custom range
        this.selectedFilters.followers = [];
        // Menambahkan range kustom yang sudah dikonversi ke dalam array followers
        const customRange = this.convertToArray(minFollowers ?? 0, maxFollowers ?? 0);
        this.selectedFilters.followers.push(customRange);
      } else {
        this.isUsingRangeFilter = false;
      }
    }
    else if (type === 'age') {
      const minAge = this.filterForm.get('minAge')?.value;
      const maxAge = this.filterForm.get('maxAge')?.value;
      if (minAge !== null || maxAge !== null) {
        if (minAge !== null && maxAge !== null){
          if(maxAge >= minAge){
            this.isInvalidRangeAge = false;
          }else{
            this.isInvalidRangeAge = true;
          }
        }
        this.isUsingRangeFilter = true;
        // Reset selected filters when using custom range
        this.selectedFilters.age = [];
        // Menambahkan range kustom yang sudah dikonversi ke dalam array age
        const customRange = this.convertToArrayAge(minAge ?? 0, maxAge ?? 0);
        this.selectedFilters.age.push(customRange);
      } else {
        this.isUsingRangeFilter = false;
      }
    }
    else if (type === 'price') {
      const minPrice = this.filterForm.get('minPrice')?.value;
      const maxPrice = this.filterForm.get('maxPrice')?.value;
      if (minPrice !== null || maxPrice !== null) {
        if (minPrice !== null && maxPrice !== null){
          if(maxPrice >= minPrice){
            this.isInvalidRangePrice = false;
          }else{
            this.isInvalidRangePrice = true;
          }
        }
        this.isUsingRangeFilter = true;
        // Reset selected filters when using custom range
        this.selectedFilters.price = [];
        // Menambahkan range kustom yang sudah dikonversi ke dalam array price
        const customRange = this.convertToArray(minPrice ?? 0, maxPrice ?? 0);
        this.selectedFilters.price.push(customRange);
      } else {
        this.isUsingRangeFilter = false;
      }
    }
    else if (type === 'ageAudience') {
      const minAgeAudience = this.filterForm.get('minAgeAudience')?.value;
      const maxAgeAudience = this.filterForm.get('maxAgeAudience')?.value;
      if (minAgeAudience !== null || maxAgeAudience !== null) {
        if (minAgeAudience !== null && maxAgeAudience !== null){
          if(maxAgeAudience >= minAgeAudience){
            this.isInvalidRangeAgeAudience = false;
          }else{
            this.isInvalidRangeAgeAudience = true;
          }
        }
        this.isUsingRangeFilter = true;
        // Reset selected filters when using custom range
        this.selectedFilters.ageAudience = [];
        // Menambahkan range kustom yang sudah dikonversi ke dalam array age
        const customRange = this.convertToArrayAge(minAgeAudience ?? 0, maxAgeAudience ?? 0);
        this.selectedFilters.ageAudience.push(customRange);
      } else {
        this.isUsingRangeFilter = false;
      }
    }
    else if (type === 'location') {
      const location = this.filterForm.get('location')?.value;
      // Pastikan lokasi yang dipilih adalah array
      if (Array.isArray(location)) {
        // Iterasi setiap lokasi yang dipilih
        location.forEach(loc => {
          // Jika lokasi belum ada dalam selectedFilters.location, tambahkan
          if (!this.selectedFilters.location.includes(loc)) {
            this.selectedFilters.location.push(loc);
          }
        });
        // Hapus lokasi yang tidak ada di form (yaitu yang telah dihapus)
        this.selectedFilters.location = this.selectedFilters.location.filter(
          loc => location.includes(loc)
        );
      }
    }
    // else if (type === 'locationAudience') {
    //   const locationAudience = this.filterForm.get('locationAudience')?.value;
    //   // Pastikan lokasi yang dipilih adalah array
    //   if (Array.isArray(locationAudience)) {
    //     // Iterasi setiap lokasi yang dipilih
    //     locationAudience.forEach(locAud => {
    //       // Jika lokasi belum ada dalam selectedFilters.location, tambahkan
    //       if (!this.selectedFilters.locationAudience.includes(locAud)) {
    //         this.selectedFilters.locationAudience.push(locAud);
    //       }
    //     });
    //     // Hapus lokasi yang tidak ada di form (yaitu yang telah dihapus)
    //     this.selectedFilters.locationAudience = this.selectedFilters.locationAudience.filter(
    //       locAud => locationAudience.includes(locAud)
    //     );
    //   }
    // }
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

  // Fungsi untuk menangani submit form
  onSubmit(): void {
    if (this.filterForm.valid) {
      if (this.isInvalidRangeFoll || this.isInvalidRangeAge || this.isInvalidRangePrice || this.isInvalidRangeAgeAudience){
        console.log('Form is not valid');
      }
      else{
        // this.isAllBoolean = false;
        // Mengirim data ke backend
        this.influencerService.sendFilter(this.selectedFilters).subscribe(
          response => {
            // this.selectedFilters2 = this.selectedFilters;

            console.log("disini selected filters2 ke ubah");
            this.selectedFilters2 = {
              followers2: [...this.selectedFilters.followers],
              media2: [...this.selectedFilters.media],
              gender2: [...this.selectedFilters.gender],
              age2: [...this.selectedFilters.age],
              price2: [...this.selectedFilters.price],
              rating2: [...this.selectedFilters.rating],
              location2: [...this.selectedFilters.location],
              genderAudience2: [...this.selectedFilters.genderAudience],
              ageAudience2: [...this.selectedFilters.ageAudience],
              sort: [], // Pastikan sort selalu kosong
              categoryChosen2: [...this.selectedFilters.categoryChosen]
            };

            this.influencer = response;
            this.influencer2 = response;
            console.log('Response from backend:', this.influencer);
            // Anda bisa mengarahkan user ke halaman lain atau memberi notifikasi berhasil
          },
          error => {
            console.error('Error occurred:', error);
            // Menangani error jika ada masalah dengan request
          }
        );
        console.log('Selected Filters:', this.selectedFilters);
        console.log('Selected Filters2:', this.selectedFilters2);
      }

    } else {
      console.log('Form is not valid');
    }
  }

  // dari sini buat sort
  isDropdownVisible: boolean = false;

  toggleDropdown(event: MouseEvent): void {
    // Toggle dropdownnya
    event.stopPropagation();
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    // Close the dropdown if clicking outside
    this.isDropdownVisible = false;
  }

  activeSortText: string = 'Popular'; // Default text
  activeSortValue: number = 1; // Default sort value

  selectSort(value: number, text: string): void {
    this.activeSortText = text;
    this.activeSortValue = value;
    this.isDropdownVisible = false;
    this.selectedFilters2.sort = [value];
    console.log("INI LAGI DI SORT");
    console.log("selFil2: " + this.selectedFilters2.categoryChosen2);

    // Send sort value to backend
    this.influencerService.sendSortOption(this.selectedFilters2).subscribe(
      (response) => {
        this.influencer = response;
        this.influencer2 = response;
        console.log('Sort option sent successfully:', this.influencer);
      },
      (error) => {
        console.error('Error sending sort option:', error);
      }
    );
  }

  getProfilePictureUrl(profilePicture: string): string {
    return profilePicture.replace(/\\"/g, ''); // Menghapus karakter escape
  }

  // getInfluencerCategory(id: any) {
  //   if(id == 0){
  //     this.influencer = this.influencer2;
  //   }
  //   else{
  //     this.influencerService.getInfluencerCategory(id, localStorage.getItem("user_id") || '', this.influencer2).subscribe(
  //       (data) => {
  //         this.influencer = data;
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     )
  //   }
  // }

  selectedId: number | null = null;

  getInfluencerCategory(id: any){
    this.selectedId = id;
    this.selectedFilters.categoryChosen = [id];
    this.selectedFilters2.categoryChosen2 = [id];

    this.influencerService.sendSortOption(this.selectedFilters2).subscribe(
      (response) => {
        this.influencer = response;
        this.influencer2 = response;
        console.log('Sort option sent successfully:', this.influencer);
      },
      (error) => {
        console.error('Error sending sort option:', error);
      }
    );
  }




}


