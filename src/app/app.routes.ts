import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {path:'', component: LandingPageComponent},
  {path:'home', component: HomeComponent},
  {path:'signup', component: SignupComponent},
  {path:'header', component: HeaderComponent}
];
