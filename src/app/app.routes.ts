import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  {path:'', component: LandingPageComponent},
  {path:'signup', component: SignupComponent}
];
