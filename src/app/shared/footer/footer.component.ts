import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  scrollTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  gotoMusic(): void {
    window.open(
      'https://music.apple.com/gh/artist/360-project/1821068616',
      '_blank',
    );
  }
  gotoPodcast(): void {
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
}
