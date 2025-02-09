import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IStaticMethods } from 'preline';
import { LoadingComponent } from "./components/loading/loading.component";
import { LoadingService } from './services/loading.service';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    FormsModule,
    HttpClientModule,
    LoadingComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fluency';

  constructor(
    private router: Router,
    public loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.HSStaticMethods) {
            window.HSStaticMethods.autoInit();
          }
        }, 100);
      }
    });
  }
}
