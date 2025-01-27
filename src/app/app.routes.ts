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
import { LoginInterceptorComponent } from './components/login-interceptor/login-interceptor.component';
import { InfluencerComponent } from './pages/influencer/influencer.component';
import { InfluencerCardComponent } from './components/influencer-card/influencer-card.component';
import { InfluencerRateCardComponent } from './pages/signup/signup-forms/influencer-rate-card/influencer-rate-card.component';
import { ProfileBrandComponent } from './pages/profile-brand/profile-brand.component';
import { CompleteProfileInfluencerComponent } from './pages/signup/signup-forms/complete-profile-influencer/complete-profile-influencer.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectCreateComponent } from './pages/project/project-create/project-create.component';
import { SavedInfluencerComponent } from './pages/saved-influencer/saved-influencer.component';
import { ProjectDetailComponent } from './pages/project/project-detail/project-detail.component';

export const routes: Routes = [
  {path:'', component: LandingPageComponent},
  {path:'home', component: HomeComponent},
  {path:'signup', component: SignupComponent},
  {path:'login', component: LoginRoleComponent},
  {path:'login/brand', component: LoginComponent},
  {path:'login/interceptor', component: LoginInterceptorComponent},
  {path:'about-us', component: AboutUsComponent},
  {path:'header', component: HeaderComponent},
  {path:'influencer', component: InfluencerComponent},
  {path:'influencer-card', component: InfluencerCardComponent},
  {path:'saved-influencer', component: SavedInfluencerComponent},
  { path: 'signup/brand/profile', component: CompleteProfileComponent },
  { path: 'signup/brand/category', component: ChooseCategoryComponent },
  { path: 'signup/brand/target', component: BrandTargetMarketComponent },
  { path: 'signup/influencer/profile', component: CompleteProfileInfluencerComponent },
  { path: 'signup/influencer/category', component: ChooseCategoryComponent },
  { path: 'signup/influencer/rate-card', component: InfluencerRateCardComponent },
  {path:'profile-brand', component: ProfileBrandComponent},
  {path:'project', component: ProjectComponent},
  {path:'project/detail', component: ProjectDetailComponent},
  {path:'project/create', component: ProjectCreateComponent},
  {path:'project/', component: ProjectCreateComponent},
  {path:'project/create', component: ProjectCreateComponent}
];
