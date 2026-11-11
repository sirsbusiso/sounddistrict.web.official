import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Article } from '../../../../models/articles/article.model.dto';
import { ArticleService } from '../../../services/article.service/article.service';
import { ShareService } from '../../../services/shared/share.service';

@Component({
  selector: 'app-read',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './read.component.html',
  styleUrl: './read.component.css',
})
export class ReadComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articleService = inject(ArticleService);
  private readonly shareService = inject(ShareService);

  article: Article | null = null;
  keywords: string[] = [];

  loading = true;
  hasError = false;
  relatedArticles: Article[] = [];
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (!slug) {
        this.loading = false;
        this.hasError = true;
        return;
      }

      this.loadArticle(slug);
      this.incrementViewCount(slug);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  incrementViewCount(slug: string): void {
    this.articleService.incrementViewCount(slug).subscribe({
      next: () => {
        if (this.article) {
          this.article.viewCount++;
        }
      },
      error: (error) => {
        console.error('Failed to increment view count', error);
      },
    });
  }
  loadRelatedArticle(slug: string): void {
    this.loading = true;
    this.hasError = false;
    this.router.navigate(['/news', slug], { replaceUrl: true });

    this.articleService.getArticleBySlug(slug).subscribe({
      next: (response: any) => {
        console.log('Article response:', response);
      },
    });
  }

  shareArticle(): void {
    if (!this.article) {
      return;
    }

    this.shareService.shareNews(this.article.slug);
  }

  shareRelatedArticle(slug: string): void {
    if (!this.article) {
      return;
    }

    this.shareService.shareNews(slug);
  }

  getRelatedArticles(): void {
    this.articleService.getArticles().subscribe({
      next: (response) => {
        this.relatedArticles = (response ?? [])
          .filter(
            (article) =>
              article.slug !== this.article?.slug && article.isPublished,
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
      },
      error: (error) => console.error(error),
    });
  }

  private loadArticle(slug: string): void {
    this.loading = true;
    this.hasError = false;

    this.articleService.getArticleBySlug(slug).subscribe({
      next: (response: any) => {
        console.log('Article response:', response);

        this.article = response;

        if (this.article) {
          this.article.content = this.article.content
            .replace(/&nbsp;/g, ' ')
            .replace(/\u00A0/g, ' ');
        }

        this.keywords = this.article?.keywords
          ? this.article.keywords
              .split(',')
              .map((keyword) => keyword.trim())
              .filter((keyword) => keyword.length > 0)
          : [];
        this.getRelatedArticles();
        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load article:', error);

        this.loading = false;
        this.hasError = true;
      },
    });
  }
}
