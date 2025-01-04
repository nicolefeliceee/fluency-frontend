import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';

export const routes: Routes = [
  {path:'', component: LandingPageComponent},
  {path:'signup', component: SignupComponent},
  {path:'header', component: HeaderComponent}
];
