import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeInfluencerComponent } from './home-influencer.component';

describe('HomeInfluencerComponent', () => {
  let component: HomeInfluencerComponent;
  let fixture: ComponentFixture<HomeInfluencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeInfluencerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
