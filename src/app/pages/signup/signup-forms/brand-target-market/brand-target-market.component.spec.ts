import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandTargetMarketComponent } from './brand-target-market.component';

describe('BrandTargetMarketComponent', () => {
  let component: BrandTargetMarketComponent;
  let fixture: ComponentFixture<BrandTargetMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandTargetMarketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrandTargetMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
