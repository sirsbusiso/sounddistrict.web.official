import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandAssetsComponent } from '../brand-assets/brand-assets.component';
import { PurchaseService } from '../../../services/shared/purchase.service';
import { Purchase, PurchaseType } from '../../../models/shared/purchase.models';
import { CookiesService } from '../../../services/shared/cookies.service';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, BrandAssetsComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  PurchaseType = PurchaseType;
  name = '';
  email = '';
  purchase?: Purchase;
  purchaseTotal = 0;

  constructor(
    private router: Router,
    private purchaseService: PurchaseService,
  ) {}

  ngOnInit(): void {
    this.purchase = this.purchaseService.getFromCookie()!;

    if (!this.purchase) {
      this.router.navigate(['/music']);
      return;
    }
    this.purchaseTotal =
      this.purchase.type === PurchaseType.Release
        ? (this.purchase.release?.price ?? 0)
        : this.purchase.tracks.reduce((total, track) => total + track.price, 0);

    console.log('Purchase from cookie:', this.purchase);
  }
  total = 0;
  checkout() {
    const request = {
      customerName: this.name,
      customerEmail: this.email,
    };

    console.log(request);

    // Payment API
  }
  removeTrack(trackId: string) {}
}
