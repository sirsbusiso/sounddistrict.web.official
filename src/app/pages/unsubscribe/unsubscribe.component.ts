import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubscriptionService } from '../../../services/subscription.service/subscription.service';
import { Unsubscribe } from '../../../models/subcription/subscription.models';

@Component({
  selector: 'app-unsubscribe',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './unsubscribe.component.html',
  styleUrl: './unsubscribe.component.css',
})
export class UnsubscribeComponent {
  subscribedToNewsletter = false;
  subscribedToMusicAlerts = false;
  unsubcribe!: Unsubscribe;

  requestId = '';
  loading = false;
  saved = false;
  isValid = true;

  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
  ) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('requestId') ?? '';

    if (!this.requestId) {
      return;
    }
  }

  savePreferences(): void {
    this.loading = true;
    this.unsubcribe = {
      requestId: this.requestId,
      musicAlerts: this.subscribedToMusicAlerts,
      newsAlerts: this.subscribedToNewsletter,
    };
    if (!this.unsubcribe.requestId) {
      this.isValid = false;
      this.loading = false;
      return;
    } else if (!this.unsubcribe.musicAlerts && !this.unsubcribe.newsAlerts) {
      this.isValid = false;
      this.loading = false;
      return;
    }

    this.subscriptionService.unsubscribeFromLists(this.unsubcribe).subscribe({
      next: () => {
        this.loading = false;
        this.saved = true;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
