import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/share`;

  shareEpisode(slug: string, title: string, description: string): void {
    const url = `${this.baseUrl}/episode/${slug}`;

    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url,
      });

      return;
    }
    navigator.clipboard.writeText(url);
  }
}
