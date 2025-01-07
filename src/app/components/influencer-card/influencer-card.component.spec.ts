import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerCardComponent } from './influencer-card.component';

describe('InfluencerCardComponent', () => {
  let component: InfluencerCardComponent;
  let fixture: ComponentFixture<InfluencerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfluencerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
