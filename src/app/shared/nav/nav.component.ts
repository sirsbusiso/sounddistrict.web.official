import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PlayerService } from '../../../services/shared/player.service';
import { filter } from 'rxjs';
import { BagAnimationComponent } from '../bag-animation/bag-animation.component';
import { PurchaseService } from '../../../services/shared/purchase.service';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, BagAnimationComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  constructor(
    private router: Router,
    public player: PlayerService,
    public purchaseService: PurchaseService,
  ) {}

  isMobileView = false;
  show = true;
  bagCount = 0;
  isCountZero = false;

  ngOnInit(): void {
    this.purchaseService.bagCount$.subscribe((count) => {
      this.bagCount = count;
      if (this.bagCount === 0) {
        this.isCountZero = true;
      } else {
        this.isCountZero = false;
      }
    });
    this.isMobileView = this.isMobile();
  }

  isMobile(): boolean {
    return window.innerWidth <= 800;
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
