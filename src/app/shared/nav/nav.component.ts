import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PlayerService } from '../../../services/shared/player.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  constructor(
    private router: Router,
    public player: PlayerService,
  ) {}

  isMusicRelease = false;
  show = true;

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url.toLowerCase();
        this.isMusicRelease =
          url.includes('/music') ||
          url.includes('/release') ||
          url.includes('/checkout');
      });
  }
  gotoMusic(): void {
    this.router.navigate(['/music']);
  }
  gotoPodcast(): void {
    this.player.setBackPlayerBackground();
    this.router.navigate(['/podcasts']);
  }
  gotoShop(): void {
    window.open('https://shop.sounddistrict.co.za', '_blank');
  }
  gotoDonate(): void {
    window.open('https://pay.yoco.com/sound-district', '_blank');
  }
  gotoHome(): void {
    this.router.navigate(['/']);
  }
  gotoUpload() {
    this.router.navigate(['/upload']);
  }
  checkout() {
    debugger;
    this.router.navigate(['/checkout']);
  }

  goToAccount(): void {
    const returnUrl = encodeURIComponent(window.location.href);

    window.open(
      `https://accounts.sounddistrict.co.za?returnUrl=${returnUrl}`,
      '_self',
    );
  }
}
