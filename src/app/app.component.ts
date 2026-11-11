import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/nav/nav.component';
import { PlayerComponent } from './shared/player/player.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { FooterComponent } from './shared/footer/footer.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { PlayerService } from '../services/shared/player.service';
import { CtaComponent } from './shared/cta/cta.component';
import { AnalyticsService } from '../services/shared/analytics.service';
import { CookiesService } from './services/shared/cookies.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavComponent,
    PlayerComponent,
    CommonModule,
    FooterComponent,
    LoaderComponent,
    CtaComponent,
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
    private analytics: AnalyticsService,
    private cookiesService: CookiesService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });

        this.analytics.trackPageView(event.urlAfterRedirects);
      });
  }
  ngOnInit(): void {
    this.showDonateButton =
      this.cookiesService.getCookie('hideDonate') !== 'true';
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

  showDonateButton = false; // Initialize to false
  // localStorage.getItem('hideDonate') !== 'true';

  closeDonate(): void {
    this.showDonateButton = false;

    this.cookiesService.setCookie('hideDonate', 'true', 7);
  }
  gotoDonate(): void {
    window.open('https://pay.yoco.com/sound-district', '_blank');
  }
}
