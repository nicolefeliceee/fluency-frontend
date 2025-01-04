import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCategoryComponent } from './choose-category.component';

describe('ChooseCategoryComponent', () => {
  let component: ChooseCategoryComponent;
  let fixture: ComponentFixture<ChooseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
