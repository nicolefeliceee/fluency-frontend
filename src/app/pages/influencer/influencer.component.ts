import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { InfluencerCardComponent } from "../../components/influencer-card/influencer-card.component";
import { TabComponent } from "../../components/tab/tab.component";
import { RangeFilterComponent } from "../../components/range-filter/range-filter.component";

@Component({
  selector: 'app-influencer',
  standalone: true,
  imports: [HeaderComponent, InfluencerCardComponent, TabComponent, RangeFilterComponent],
  templateUrl: './influencer.component.html',
  styleUrl: './influencer.component.css'
})
export class InfluencerComponent {

}
