import { Component } from '@angular/core';
import { MusicRelease } from '../../../models/music-release/music-release.models';
import { MusicReleaseService } from '../../../services/music-release.service/music-release.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MusicTrack } from '../../../models/music-track/music-track.models';
import { ReleaseType } from '../../../models/shared/shared.models';
import { FormsModule } from '@angular/forms';
import {
  SearchResult,
  SearchResultType,
} from '../../../models/search/search-result.model';
import { SearchComponent } from '../../shared/search/search.component';

@Component({
  selector: 'app-music',
  imports: [CommonModule, FormsModule, SearchComponent],
  templateUrl: './music.component.html',
  styleUrl: './music.component.css',
})
export class MusicComponent {
  releases: MusicRelease[] = [];
  today = new Date();
  ReleaseType = ReleaseType;
  releaseId = '';
  selectedType?: ReleaseType;
  search = '';
  displayReleases: MusicRelease[] = [];
  searchResults: MusicRelease[] = [];
  showResults = false;
  constructor(
    private musicReleaseService: MusicReleaseService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.releaseId = this.route.snapshot.paramMap.get('id')!;
    this.getReleases();
  }

  filter(type?: ReleaseType): void {
    this.selectedType = type;

    if (type === undefined) {
      this.displayReleases = [...this.releases];
      return;
    }

    this.displayReleases = this.releases.filter((x) => x.releaseType === type);
  }
  getReleases() {
    this.musicReleaseService.getAll().subscribe({
      next: (response) => {
        if (response) {
          this.releases = response.data
            .filter((x) => {
              const hasTracks = (x.tracks?.length ?? 0) > 0;

              const isReleased = x.isPublished && x.releaseDate != null;
              const isScheduled = !x.isPublished && x.scheduleDate != null;

              return hasTracks && (isReleased || isScheduled);
            })
            .sort((a, b) => {
              const dateA = new Date(
                a.releaseDate ?? a.scheduleDate!,
              ).getTime();
              const dateB = new Date(
                b.releaseDate ?? b.scheduleDate!,
              ).getTime();

              return dateB - dateA; // Latest first
            });
          this.displayReleases = [...this.releases];
        }
      },
    });
  }

  countTracks(tracks: MusicTrack[] | undefined): number {
    return tracks?.length ?? 0;
  }

  viewRelease(release: MusicRelease) {
    this.router.navigate(['/release', release.slug]);
  }

  onSearch(): void {
    const term = this.search.trim().toLowerCase();

    if (term.length < 2) {
      this.searchResults = [];
      this.showResults = false;
      return;
    }

    this.searchResults = this.releases
      .filter(
        (track) =>
          track.title.toLowerCase().includes(term) ||
          track.artistName.toLowerCase().includes(term) ||
          track.subGenre!.toLowerCase().includes(term) ||
          track.genre!.toLowerCase().includes(term) ||
          track.labelName!.toLocaleLowerCase().includes(term),
      )
      .slice(0, 8);

    this.showResults = true;
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
