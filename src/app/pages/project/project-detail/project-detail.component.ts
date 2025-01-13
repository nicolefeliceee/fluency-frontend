import { Component } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent {

  projectDetailStoryList: any[] = [];
  projectDetailFeedsList: any[] = [];
  projectDetailReelsList: any[] = [];

  addStory() {
    
  }

}
