import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/nav/nav.component';
import { PlayerComponent } from './shared/player/player.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { FooterComponent } from './shared/footer/footer.component';
import { LoaderComponent } from './shared/loader/loader.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        NavComponent,
        PlayerComponent,
        CommonModule,
        FooterComponent,
        LoaderComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sound District Official';

  isHome = false;

  constructor(public router: Router) {}

  gotoUpload() {
    this.router.navigate(['/upload']);
  }

  showUploadFab = false;

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;

    const triggerPoint = document.documentElement.scrollHeight * 0.5;

    this.showUploadFab = scrollPosition >= triggerPoint;

    this.showUploadFab = false;
  }
}
