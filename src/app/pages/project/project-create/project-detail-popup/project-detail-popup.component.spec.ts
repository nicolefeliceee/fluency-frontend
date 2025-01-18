import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailPopupComponent } from './project-detail-popup.component';

describe('ProjectDetailPopupComponent', () => {
  let component: ProjectDetailPopupComponent;
  let fixture: ComponentFixture<ProjectDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
