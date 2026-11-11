import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Article } from '../../../models/articles/article.model.dto';
import { Track } from '../../../models/podcast/podcast.models';
import { MusicRelease } from '../../../models/music-release/music-release.models';
import {
  SearchResult,
  SearchResultType,
} from '../../../models/search/search-result.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Input() articles: Article[] | null = null;
  @Input() podcasts: Track[] | null = null;
  @Input() releases: MusicRelease[] | null = null;

  @Output() articleSelected = new EventEmitter<Article>();

  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;
  @Output() itemSelected = new EventEmitter<SearchResult>();
  isOpen = false;

  searchQuery = '';

  suggestions: SearchResult[] = [];

  open(): void {
    this.isOpen = true;

    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    });
  }

  close(): void {
    this.isOpen = false;
    this.searchQuery = '';
    this.suggestions = [];
  }

  search(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (query.length < 2) {
      this.suggestions = [];
      return;
    }

    const results: SearchResult[] = [];

    if (this.articles?.length) {
      results.push(
        ...this.articles
          .filter(
            (article) =>
              article.title.toLowerCase().includes(query) ||
              article.summary.toLowerCase().includes(query) ||
              article.category.toLowerCase().includes(query) ||
              article.author.toLowerCase().includes(query) ||
              article.keywords?.toLowerCase().includes(query),
          )
          .map(
            (article): SearchResult => ({
              type: SearchResultType.Article,
              id: article.id,
              title: article.title,
              slug: article.slug,
              imageUrl: article.coverImageUrl!,
              category: article.category,
              item: article,
            }),
          ),
      );
    }

    if (this.podcasts?.length) {
      results.push(
        ...this.podcasts
          .filter(
            (podcast) =>
              podcast.title.toLowerCase().includes(query) ||
              podcast.description?.toLowerCase().includes(query),
          )
          .map(
            (podcast): SearchResult => ({
              type: SearchResultType.Podcast,
              title: podcast.title,
              slug: podcast.slug,
              imageUrl: podcast.artworkUrl, // change if your model uses another property
              category: 'Podcast',
              item: podcast,
            }),
          ),
      );
    }

    if (this.releases?.length) {
      results.push(
        ...this.releases
          .filter(
            (release) =>
              release.title.toLowerCase().includes(query) ||
              release.artistName.toLowerCase().includes(query),
          )
          .map(
            (release): SearchResult => ({
              type: SearchResultType.Release,
              id: release.id,
              title: release.title,
              slug: release.slug,
              imageUrl: release.artworkUrl!, // or coverImageUrl if that's your property
              category: 'Music Release',
              item: release,
            }),
          ),
      );
    }

    this.suggestions = results.slice(0, 8);
  }
  select(result: SearchResult): void {
    this.itemSelected.emit(result);
    this.close();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isOpen && this.suggestions.length < 0) {
      this.close();
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.floating-search')) {
      this.close();
    }
  }
}
