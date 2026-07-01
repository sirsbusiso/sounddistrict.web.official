import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  constructor(private router: Router) {}
  gotoMusic(): void {
    this.router.navigate(['/music']);
  }
  gotoPodcast(): void {
    this.router.navigate(['/podcasts']);
  }
  gotoShop(): void {
    window.open('https://shop.sounddistrict.co.za', '_blank');
  }
  gotoDonate(): void {
    this.router.navigate(['/donate']);
  }
  gotoHome(): void {
    this.router.navigate(['/']);
  }
}
