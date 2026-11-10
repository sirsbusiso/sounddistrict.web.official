import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  trackPageView(url: string): void {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: url,
    });
  }

  trackEvent(eventName: string, params: any = {}): void {
    gtag('event', eventName, params);
  }
}
