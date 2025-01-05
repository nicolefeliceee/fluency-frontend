import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CompleteProfileComponent } from './pages/signup/signup-forms/complete-profile/complete-profile.component';
import { ChooseCategoryComponent } from './pages/signup/signup-forms/choose-category/choose-category.component';
import { BrandTargetMarketComponent } from './pages/signup/signup-forms/brand-target-market/brand-target-market.component';
import { LoginRoleComponent } from './pages/login/login-role/login-role.component';

export const routes: Routes = [
  {path:'', component: LandingPageComponent},
  {path:'home', component: HomeComponent},
  {path:'signup', component: SignupComponent},
  {path:'login', component: LoginRoleComponent},
  {path:'about-us', component: AboutUsComponent},
  {path:'header', component: HeaderComponent},
  { path: 'signup/brand/profile', component: CompleteProfileComponent },
  { path: 'signup/brand/category', component: ChooseCategoryComponent },
  { path: 'signup/brand/target', component: BrandTargetMarketComponent }
];
