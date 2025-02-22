import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { Router } from '@angular/router';
import { InfluencerService } from '../../services/influencer.service';
import { ConfirmationPopupComponent } from "../confirmation-popup/confirmation-popup.component";

@Component({
  selector: 'app-influencer-card',
  standalone: true,
  imports: [CommonModule, ConfirmationPopupComponent],
  templateUrl: './influencer-card.component.html',
  styleUrl: './influencer-card.component.css'
})
export class InfluencerCardComponent{

  constructor(
    private router: Router,
    private influencerService: InfluencerService
  ) {
  }

  categoryColors: { [key: string]: string } = {
    "Fashion": "bg-pastel-1",
    "F&B": "bg-pastel-11",
    "Beauty": "bg-pastel-3",
    "Entertainment": "bg-pastel-4",
    "Technology": "bg-pastel-5",
    "Health": "bg-pastel-6",
    "Sport": "bg-pastel-7",
    "Travel": "bg-pastel-8",
    "Otomotive": "bg-pastel-9",
    "Household": "bg-pastel-10",
    "Hobby": "bg-pastel-2",
    "Finance": "bg-pastel-12"
  };

  getCategoryColor(category: string): string {
    return this.categoryColors[category] || "bg-pastel-1"; // Default jika tidak ditemukan
  }

  // @Input() item: any; // Data influencer dari parent

  goToDetail() {
    console.log("item id: " + this.item['influencer_id']);
    this.router.navigate(['/influencer-detail', this.item['influencer_id']]); // Redirect ke halaman detail
  }


  // INI INFLUENCER
  @Input() item!: any;


  @Input() isInfluencer!: any;

  getProfilePictureUrl(profilePicture: string): string {
    return profilePicture.replace(/\\"/g, ''); // Menghapus karakter escape
  }

  // buat emit influencer id
  hireClicked = output<any>();
  askConfirmHireInfluencer = output<any>();
  redirectToProject() {
    this.hireClicked.emit(this.item['influencer_id']);
  }

  askConfirm() {
    this.askConfirmHireInfluencer.emit(this.item['influencer_id']);
  }

  // Fungsi untuk toggle status saved
  toggleSave(influencerUserId: number) {
    this.item.issaved = !this.item.issaved;

    if (this.item.issaved) {
      // Kirim data ke backend hanya jika influencer disimpan
      this.influencerService.saveInfluencer(influencerUserId).subscribe(
        response => {
          console.log('Influencer saved successfully:', response);
        },
        error => {
          console.error('Error saving influencer:', error);
          this.item.issaved = false;
        }
      );
    } else{
      this.influencerService.unsaveInfluencer(influencerUserId).subscribe(
        response => {
          console.log('Influencer unsaved successfully:', response);
        },
        error => {
          console.error('Error unsaving influencer:', error);
          this.item.issaved = true;
        }
      );
    }
  }




}
