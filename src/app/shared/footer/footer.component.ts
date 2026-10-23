import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../../services/subscription.service/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  email = '';
  constructor(
    private router: Router,
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar,
  ) {}

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
  subscribe(): void {
    this.subscriptionService.subscribeToLists(this.email).subscribe({
      next: (response) => {
        this.email = '';
        if (response.statusCode === 200) {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
            panelClass: ['success-snack'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        } else if (response.statusCode === 409) {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
            panelClass: ['snack-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      },
      error: (error) => {},
    });
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
