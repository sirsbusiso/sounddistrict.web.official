import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../../models/articles/article.model.dto';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service/article.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css',
})
export class ArticlesComponent implements OnInit {
  constructor(
    private articleService: ArticleService,
    private router: Router,
  ) {}

  articles: Article[] = [];

  loading = false;
  error = '';

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles(): void {
    this.loading = true;
    this.error = '';

    this.articleService.getArticles().subscribe({
      next: (response) => {
        this.articles = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load articles.';
      },
    });
  }

  trackById(index: number, article: Article): string {
    return article.id;
  }

  openArticle(slug: string): void {
    this.router.navigate(['/news', slug]);
  }
}
