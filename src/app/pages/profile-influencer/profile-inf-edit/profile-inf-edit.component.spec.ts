import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInfEditComponent } from './profile-inf-edit.component';

describe('ProfileInfEditComponent', () => {
  let component: ProfileInfEditComponent;
  let fixture: ComponentFixture<ProfileInfEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileInfEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileInfEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
