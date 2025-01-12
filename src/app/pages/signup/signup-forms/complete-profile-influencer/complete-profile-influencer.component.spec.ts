import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProfileInfluencerComponent } from './complete-profile-influencer.component';

describe('CompleteProfileInfluencerComponent', () => {
  let component: CompleteProfileInfluencerComponent;
  let fixture: ComponentFixture<CompleteProfileInfluencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteProfileInfluencerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteProfileInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
