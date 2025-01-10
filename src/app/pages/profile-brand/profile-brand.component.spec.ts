import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBrandComponent } from './profile-brand.component';

describe('ProfileBrandComponent', () => {
  let component: ProfileBrandComponent;
  let fixture: ComponentFixture<ProfileBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileBrandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
