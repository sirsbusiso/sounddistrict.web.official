import { Component } from '@angular/core';
import { SubscriptionService } from '../../../services/subscription.service/subscription.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-subscribe',
    imports: [CommonModule, FormsModule],
    templateUrl: './subscribe.component.html',
    styleUrl: './subscribe.component.css'
})
export class SubscribeComponent {
  email: string = '';
  constructor(
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar,
  ) {}

  subscribe(): void {
    this.subscriptionService.subscribeToNewsletter(this.email).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
            panelClass: ['success-snack'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          debugger;
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
}
