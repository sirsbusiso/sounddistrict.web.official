import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookiesService } from './cookies.service';
import {
  Purchase,
  PurchaseRelease,
  PurchaseTrack,
  PurchaseType,
} from '../../models/shared/purchase.models';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private purchaseSubject = new BehaviorSubject<Purchase>({
    type: PurchaseType.Tracks,
    tracks: [],
  });

  purchase$ = this.purchaseSubject.asObservable();

  constructor(private cookiesService: CookiesService) {}

  get purchase(): Purchase {
    return this.purchaseSubject.value;
  }

  private saveToCookie(purchase: Purchase): void {
    this.cookiesService.setCookie('purchase', JSON.stringify(purchase), 1);
  }

  getFromCookie(): Purchase | null {
    const cookie = this.cookiesService.getCookie('purchase');

    if (!cookie) {
      return null;
    }

    try {
      return JSON.parse(cookie) as Purchase;
    } catch {
      this.cookiesService.deleteCookie('purchase');
      return null;
    }
  }

  private initialize(): void {
    const cookie = this.cookiesService.getCookie('purchase');

    if (!cookie) {
      return;
    }

    try {
      this.purchaseSubject.next(JSON.parse(cookie) as Purchase);
    } catch {
      this.cookiesService.deleteCookie('purchase');
    }
  }

  private updatePurchase(purchase: Purchase): void {
    this.purchaseSubject.next(purchase);

    this.cookiesService.setCookie('purchase', JSON.stringify(purchase), 1);
  }

  buyRelease(release: PurchaseRelease): void {
    const purchase = this.purchase;

    // Already buying this release
    if (
      purchase.type === PurchaseType.Release &&
      purchase.release?.id === release.id
    ) {
      return;
    }

    this.updatePurchase({
      type: PurchaseType.Release,
      release,
      tracks: [],
    });
  }

  buyTrack(track: PurchaseTrack): void {
    const purchase = this.purchase;

    // If a release was selected, start a new track list
    const tracks =
      purchase.type === PurchaseType.Release ? [] : [...purchase.tracks];

    // Prevent duplicates
    if (!tracks.some((t) => t.id === track.id)) {
      tracks.push(track);
    }

    this.updatePurchase({
      type: PurchaseType.Tracks,
      tracks,
    });
  }

  removeTrack(trackId: string): void {
    this.updatePurchase({
      type: PurchaseType.Tracks,
      tracks: this.purchase.tracks.filter((t) => t.id !== trackId),
    });
  }

  clear(): void {
    this.cookiesService.deleteCookie('purchase');

    this.purchaseSubject.next({
      type: PurchaseType.Tracks,
      tracks: [],
    });
  }

  getTotal(): number {
    if (this.purchase.type === PurchaseType.Release) {
      return this.purchase.release?.price ?? 0;
    }

    return this.purchase.tracks.reduce(
      (total, track) => total + track.price,
      0,
    );
  }

  hasItems(): boolean {
    return (
      this.purchase.type === PurchaseType.Release ||
      this.purchase.tracks.length > 0
    );
  }
}
