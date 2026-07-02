import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav',
    imports: [],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css'
})
export class NavComponent {
  constructor(private router: Router) {}
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
