import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private http = inject(HttpClient);
  private websiteUrl = 'https://sounddistrict.co.za';

  shareEpisode(slug: string): void {
    const url = `${this.websiteUrl}/episode/${encodeURIComponent(slug)}`;

    if (navigator.share) {
      navigator.share({
        url,
      });
      return;
    }

    navigator.clipboard.writeText(url);
  }

  shareRelease(slug: string): void {
    const url = `${this.websiteUrl}/release/${encodeURIComponent(slug)}`;

    if (navigator.share) {
      navigator.share({
        url,
      });
      return;
    }

    navigator.clipboard.writeText(url);
  }
}
