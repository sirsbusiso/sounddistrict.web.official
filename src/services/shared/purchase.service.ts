import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookiesService } from './cookies.service';
import {
  Purchase,
  PurchaseRelease,
  PurchaseTrack,
} from '../../models/shared/purchase.models';
import { BagAnimationService } from './bag.animation';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private purchaseSubject = new BehaviorSubject<Purchase>({
    releases: [],
    tracks: [],
  });

  purchase$ = this.purchaseSubject.asObservable();

  private bagCountSubject = new BehaviorSubject<number>(0);
  bagCount$ = this.bagCountSubject.asObservable();

  bagCount = 0;

  constructor(
    private cookiesService: CookiesService,
    private bagAnimation: BagAnimationService,
  ) {
    try {
      const purchase = this.getFromCookie();
      this.purchaseSubject.next(purchase);

      const bagCount = this.getBagCount();
      this.bagCount = bagCount;
      this.bagCountSubject.next(bagCount);
    } catch (e) {
      console.error(e);
    }
  }

  get purchase(): Purchase {
    return this.purchaseSubject.value;
  }

  private updatePurchase(purchase: Purchase): void {
    this.purchaseSubject.next(purchase);
    this.cookiesService.setCookie('purchase', JSON.stringify(purchase), 1);
  }

  getFromCookie(): Purchase {
    const cookie = this.cookiesService.getCookie('purchase');

    if (!cookie) {
      return {
        releases: [],
        tracks: [],
      };
    }

    try {
      const purchase = JSON.parse(cookie);

      // Support old purchase format
      if (purchase.release) {
        return {
          releases: [purchase.release],
          tracks: purchase.tracks ?? [],
        };
      }

      return {
        releases: purchase.releases ?? [],
        tracks: purchase.tracks ?? [],
      };
    } catch {
      this.cookiesService.deleteCookie('purchase');

      return {
        releases: [],
        tracks: [],
      };
    }
  }

  buyRelease(release: PurchaseRelease): void {
    const purchase = this.purchase;

    if (purchase.releases.some((r) => r.id === release.id)) {
      return;
    }

    const tracks = purchase.tracks.filter((t) => t.releaseId !== release.id);

    const updatedPurchase: Purchase = {
      releases: [...purchase.releases, release],
      tracks,
    };

    this.updatePurchase(updatedPurchase);
    this.updateBagCount(updatedPurchase);

    this.bagAnimation.show(release.artworkUrl);
  }

  buyTrack(track: PurchaseTrack): void {
    const purchase = this.purchase;

    if (purchase.tracks.some((t) => t.id === track.id)) {
      return;
    }

    const releases = purchase.releases.filter((r) => r.id !== track.releaseId);

    const updatedPurchase: Purchase = {
      releases,
      tracks: [...purchase.tracks, track],
    };

    this.updatePurchase(updatedPurchase);
    this.updateBagCount(updatedPurchase);

    this.bagAnimation.show(track.artworkUrl);
  }

  removeRelease(releaseId: string): void {
    const updatedPurchase: Purchase = {
      releases: this.purchase.releases.filter((r) => r.id !== releaseId),
      tracks: this.purchase.tracks,
    };

    this.updatePurchase(updatedPurchase);
    this.updateBagCount(updatedPurchase);
  }

  removeTrack(trackId: string): void {
    const updatedPurchase: Purchase = {
      releases: this.purchase.releases,
      tracks: this.purchase.tracks.filter((t) => t.id !== trackId),
    };

    this.updatePurchase(updatedPurchase);
    this.updateBagCount(updatedPurchase);
  }

  private updateBagCount(purchase: Purchase): void {
    this.bagCount = purchase.releases.length + purchase.tracks.length;
    this.increaseBagCount(this.bagCount);
  }

  removeCount() {
    this.bagCount = 0;
    this.increaseBagCount(this.bagCount);
  }

  increaseBagCount(count: number): void {
    this.bagCount = count;
    this.bagCountSubject.next(count);
    this.cookiesService.setCookie('bagCount', count.toString(), 7);
  }

  clear(): void {
    this.cookiesService.deleteCookie('purchase');
    this.cookiesService.deleteCookie('bagCount');

    const emptyPurchase: Purchase = {
      releases: [],
      tracks: [],
    };

    this.purchaseSubject.next(emptyPurchase);

    this.increaseBagCount(0);
  }

  getTotal(): number {
    const releaseTotal = this.purchase.releases.reduce(
      (total, release) => total + release.price,
      0,
    );

    const trackTotal = this.purchase.tracks.reduce(
      (total, track) => total + track.price,
      0,
    );

    return releaseTotal + trackTotal;
  }

  hasItems(): boolean {
    return this.purchase.releases.length > 0 || this.purchase.tracks.length > 0;
  }

  getBagCount(): number {
    return Number(this.cookiesService.getCookie('bagCount') || 0);
  }
}
