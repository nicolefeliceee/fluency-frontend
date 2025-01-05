import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRoleComponent } from './login-role.component';

describe('LoginRoleComponent', () => {
  let component: LoginRoleComponent;
  let fixture: ComponentFixture<LoginRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
