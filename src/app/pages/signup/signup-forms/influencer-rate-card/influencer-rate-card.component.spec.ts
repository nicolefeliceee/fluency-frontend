import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerRateCardComponent } from './influencer-rate-card.component';

describe('InfluencerRateCardComponent', () => {
  let component: InfluencerRateCardComponent;
  let fixture: ComponentFixture<InfluencerRateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerRateCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfluencerRateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
