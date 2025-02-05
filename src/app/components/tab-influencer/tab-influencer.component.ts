import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, output, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { emit } from 'process';
import { InfluencerService } from '../../services/influencer.service';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-tab-influencer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
    if (changes['selectedId']) {
      console.log('SelectedId changed:', this.selectedId);
    }
  }

  constructor(private influencerService: InfluencerService) {}

  @Input() options!: any[];
  @Input() paramName!: any;
  @Input() isAll!: boolean;
  // @Input() selectedId: number | null = null;  // Menambahkan selectedId sebagai Input

  @Input() selectedId: any; // Default ke '0'

  // Emit data ke parent
  @Output() id = new EventEmitter<any>();
  @Output() searchResults = new EventEmitter<Influencer[] | null>();

  // if (isAll == true) {
  //   this.selectedId = 0;
  // }

  // id = output<any>();

  opentab(id: any) {
    console.log(id);
    this.selectedId = id;
    console.log(this.selectedId);
    console.log(this.selectedId == id);
    this.id.emit(id);
  }

  ngOnInit(): void {
    console.log(this.options);
    console.log("init selected id: " + this.selectedId);
    if(this.selectedId == null){
      this.opentab(0);
    }
    else{
      this.opentab(this.selectedId);
    }
  }

  searchQuery: string = '';
  influencers: Influencer[] = []; // Tipe array Influencer
  @Input() isSavedPage: boolean = false;
  @Input() isSearching: boolean = false;

  onSearch() {
    if (this.searchQuery.trim() === '') {
      this.isSearching = false;
      this.searchResults.emit(null);  // Kirim `null` untuk reset
      return;
      // this.influencers = []; // Kosongkan jika tidak ada input
      // this.searchResults.emit(this.influencers);
      // return;
    }

    console.log("ini search query: " + this.searchQuery);
    this.isSearching = true;

    if(this.isSavedPage){
      this.influencerService.searchInfluencersSaved(this.searchQuery).subscribe((data) => {
        this.influencers = data;
        console.log("ini data influencer searched: " + this.searchQuery + JSON.stringify(this.influencers, null, 2));
        this.searchResults.emit(this.influencers);
      });
    }else{
      this.influencerService.searchInfluencers(this.searchQuery).subscribe((data) => {
        this.influencers = data;
        console.log("ini data influencer searched: " + this.searchQuery + JSON.stringify(this.influencers, null, 2));
        this.searchResults.emit(this.influencers);
      });
    }
  }

}
