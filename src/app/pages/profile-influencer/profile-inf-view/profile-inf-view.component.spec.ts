import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInfViewComponent } from './profile-inf-view.component';

describe('ProfileInfViewComponent', () => {
  let component: ProfileInfViewComponent;
  let fixture: ComponentFixture<ProfileInfViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileInfViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileInfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
