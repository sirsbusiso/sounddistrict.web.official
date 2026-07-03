import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(config: SeoConfig): void {
    this.title.setTitle(config.title);

    this.updateTag('name', 'description', config.description);
    this.updateTag('name', 'keywords', config.keywords);
    this.updateTag('name', 'robots', 'index, follow');

    this.updateTag('property', 'og:type', config.type ?? 'website');
    this.updateTag('property', 'og:title', config.title);
    this.updateTag('property', 'og:description', config.description);
    this.updateTag('property', 'og:image', config.image);
    this.updateTag('property', 'og:url', config.url);
    this.updateTag('property', 'og:site_name', 'Sound District');

    this.updateTag('name', 'twitter:card', 'summary_large_image');
    this.updateTag('name', 'twitter:title', config.title);
    this.updateTag('name', 'twitter:description', config.description);
    this.updateTag('name', 'twitter:image', config.image);
  }

  private updateTag(
    attr: 'name' | 'property',
    key: string,
    value?: string,
  ): void {
    if (!value) {
      return;
    }

    this.meta.updateTag({
      [attr]: key,
      content: value,
    });
  }
}

export interface SeoConfig {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}
