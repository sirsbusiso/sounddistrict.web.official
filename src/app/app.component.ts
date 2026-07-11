import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/nav/nav.component';
import { PlayerComponent } from './shared/player/player.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { FooterComponent } from './shared/footer/footer.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { PlayerService } from '../services/shared/player.service';

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
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Sound District Official';

  isHome = false;
  showUploadFab = false;

  constructor(
    public router: Router,
    public player: PlayerService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
  }

  gotoUpload(): void {
    this.router.navigate(['/upload']);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const triggerPoint = document.documentElement.scrollHeight * 0.5;

    this.showUploadFab = scrollPosition >= triggerPoint;
  }
}
