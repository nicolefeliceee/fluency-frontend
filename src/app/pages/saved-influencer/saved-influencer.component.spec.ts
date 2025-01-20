import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedInfluencerComponent } from './saved-influencer.component';

describe('SavedInfluencerComponent', () => {
  let component: SavedInfluencerComponent;
  let fixture: ComponentFixture<SavedInfluencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedInfluencerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
