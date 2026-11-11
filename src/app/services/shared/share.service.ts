import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private readonly websiteUrl = 'https://sounddistrict.co.za';

  shareEpisode(slug: string): void {
    const url = `${this.websiteUrl}/episode/${encodeURIComponent(slug)}`;

    if (navigator.share) {
      navigator.share({ url });
      return;
    }

    navigator.clipboard.writeText(url);
  }

  shareRelease(slug: string): void {
    const url = `${this.websiteUrl}/release/${encodeURIComponent(slug)}`;

    if (navigator.share) {
      navigator.share({ url });
      return;
    }

    navigator.clipboard.writeText(url);
  }

  shareNews(slug: string): void {
    const url = `${this.websiteUrl}/news/${encodeURIComponent(slug)}`;

    if (navigator.share) {
      navigator.share({ url });
      return;
    }

    navigator.clipboard.writeText(url);
  }
}
