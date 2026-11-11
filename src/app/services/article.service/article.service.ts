import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Article,
  ArticleAdd,
  ArticleUpdate,
  Category,
} from '../../../models/articles/article.model.dto';
@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/article`;

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.api);
  }

  getFeaturedArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.api}/featured`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.api}/${id}`);
  }

  getArticleBySlug(slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.api}/slug/${slug}`);
  }

  createArticle(article: ArticleAdd): Observable<string> {
    return this.http.post<string>(this.api, article);
  }

  updateArticle(article: ArticleUpdate): Observable<boolean> {
    return this.http.patch<boolean>(this.api, article);
  }

  deleteArticle(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.api}/${id}`);
  }

  publishArticle(slug: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.api}/${slug}/publish`, {});
  }

  unpublishArticle(slug: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.api}/${slug}/unpublish`, {});
  }

  incrementViewCount(slug: string): Observable<void> {
    return this.http.patch<void>(`${this.api}/view/${slug}`, {});
  }

  uploadCoverImage(articleId: string, file: File): Observable<string> {
    const formData = new FormData();

    formData.append('articleId', articleId);
    formData.append('file', file);

    return this.http.post<string>(`${this.api}/upload`, formData);
  }
}
