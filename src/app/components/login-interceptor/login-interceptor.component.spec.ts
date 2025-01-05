import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginInterceptorComponent } from './login-interceptor.component';

describe('LoginInterceptorComponent', () => {
  let component: LoginInterceptorComponent;
  let fixture: ComponentFixture<LoginInterceptorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginInterceptorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginInterceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
