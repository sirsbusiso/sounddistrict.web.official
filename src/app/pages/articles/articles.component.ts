import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../../models/articles/article.model.dto';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service/article.service';
import { ShareService } from '../../services/shared/share.service';
import { TimeAgoPipe } from '../../utils/time-ago-pipe';
import { SearchComponent } from '../../shared/search/search.component';
import {
  SearchResult,
  SearchResultType,
} from '../../../models/search/search-result.model';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, SearchComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css',
})
export class ArticlesComponent implements OnInit {
  constructor(
    private articleService: ArticleService,
    private router: Router,
    private shareService: ShareService,
  ) {}

  articles: Article[] = [];

  loading = false;
  error = '';
  featuredArticle?: Article;
  displayArticles: Article[] = [];
  ngOnInit(): void {
    this.getArticles();
  }

  currentPage = 1;
  pageSize = 9;

  get pagedArticles() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.displayArticles.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.displayArticles.length / this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getArticles(): void {
    this.loading = true;
    this.error = '';

    this.articleService.getArticles().subscribe({
      next: (response) => {
        this.articles = (response ?? []).filter(
          (article) => article.isPublished,
        );

        this.articles.sort((a, b) => {
          const timeA = a.publishedDate
            ? new Date(a.publishedDate).getTime()
            : 0;

          const timeB = b.publishedDate
            ? new Date(b.publishedDate).getTime()
            : 0;

          return timeB - timeA; // Newest first
        });
        console.log(this);
        const featured = this.articles.filter((a) => a.isFeatured);
        this.displayArticles = this.articles.filter(
          (article) => article.id !== this.featuredArticle?.id,
        );
        if (featured.length > 0) {
          this.featuredArticle =
            featured[Math.floor(Math.random() * featured.length)];
        } else {
          this.featuredArticle = this.articles[0];
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load articles.';
      },
    });
  }
  shareArticle(slug: string): void {
    this.shareService.shareNews(slug);
  }
  trackById(index: number, article: Article): string {
    return article.id;
  }

  openArticle(slug: string): void {
    this.router.navigate(['/news', slug]);
  }

  openSearchResult(result: SearchResult): void {
    switch (result.type) {
      case SearchResultType.Podcast:
        this.router.navigate(['/episode', result.slug]);
        break;

      case SearchResultType.Article:
        this.router.navigate(['/news', result.slug]);
        break;

      case SearchResultType.Release:
        this.router.navigate(['/release', result.slug]);
        break;
    }
  }
}
