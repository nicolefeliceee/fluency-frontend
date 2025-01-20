import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabInfluencerComponent } from './tab-influencer.component';

describe('TabInfluencerComponent', () => {
  let component: TabInfluencerComponent;
  let fixture: ComponentFixture<TabInfluencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabInfluencerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
