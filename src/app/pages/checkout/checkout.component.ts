import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandAssetsComponent } from '../brand-assets/brand-assets.component';
import { PurchaseService } from '../../../services/shared/purchase.service';
import {
  Purchase,
  PurchaseRelease,
  PurchaseTrack,
} from '../../../models/shared/purchase.models';
import { ReleaseType } from '../../../models/shared/shared.models';
import { MusicPurchaseService } from '../../../services/purchase.service/purchase.service';
import { MusicCheckoutRequest } from '../../../models/purchase/purchase.models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, BrandAssetsComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  purchase?: Purchase;

  purchaseRelease?: PurchaseRelease;
  purchaseTrack?: PurchaseTrack;
  ReleaseType = ReleaseType;
  name = '';
  email = '';

  purchaseTotal = 0;

  constructor(
    private router: Router,
    public purchaseService: PurchaseService,
    private musicPurchaseService: MusicPurchaseService,
  ) {}

  ngOnInit(): void {
    this.purchase = this.purchaseService.getFromCookie()!;
    console.log(this.purchase);
    if (!this.purchase) {
      this.router.navigate(['/music']);
      return;
    }

    this.refreshTotal();
  }

  private refreshTotal(): void {
    this.purchaseTotal = this.purchaseService.getTotal();
  }

  checkout(): void {
    this.purchase = this.purchaseService.getFromCookie();

    if (!this.purchase) {
      return;
    }

    const request: MusicCheckoutRequest = {
      fullName: this.name,
      email: this.email,
      items: [
        ...this.purchase.releases.map((release) => ({
          musicReleaseId: release.id,
        })),
        ...this.purchase.tracks.map((track) => ({
          musicTrackId: track.id,
        })),
      ],
    };

    this.musicPurchaseService.checkout(request).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          window.location.href = response.data;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  removeRelease(releaseId: string): void {
    this.purchaseService.removeRelease(releaseId);

    this.purchase = this.purchaseService.purchase;

    this.refreshTotal();

    if (!this.purchaseService.hasItems()) {
      this.router.navigate(['/music']);
    }
  }

  removeTrack(trackId: string): void {
    this.purchaseService.removeTrack(trackId);

    this.purchase = this.purchaseService.purchase;

    this.refreshTotal();

    if (!this.purchaseService.hasItems()) {
      this.router.navigate(['/music']);
    }
  }

  goToRelease(release: PurchaseRelease): void {
    this.router.navigate(['/release', release.slug]);
  }

  routeBackToRelease(track: PurchaseTrack) {
    this.router.navigate(['/release', track.slug]);
  }
}
