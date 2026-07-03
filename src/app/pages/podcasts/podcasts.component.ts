import { Component } from '@angular/core';
import { PlayerService } from '../../../services/shared/player.service';
import { PodcastService } from '../../../services/podcast.service/podcast.service';
import { Router } from '@angular/router';
import { CommonModule, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Track } from '../../../models/podcast/podcast.models';

@Component({
  selector: 'app-podcasts',
  imports: [SlicePipe, CommonModule, FormsModule],
  templateUrl: './podcasts.component.html',
  styleUrl: './podcasts.component.css',
})
export class PodcastsComponent {
  tracks: Track[] = [];
  pagedTracks: Track[] = [];

  currentPage = 1;
  pageSize = 5;
  searchTerm = '';

  searchResults: Track[] = [];
  showResults = false;

  constructor(
    private podcastService: PodcastService,
    public player: PlayerService,
    private router: Router,
  ) {}

  get totalPages(): number {
    return Math.ceil(this.tracks.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    this.loadTracks();
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (term.length < 2) {
      this.searchResults = [];
      this.showResults = false;
      return;
    }

    this.searchResults = this.tracks
      .filter(
        (track) =>
          track.title.toLowerCase().includes(term) ||
          track.genre.toLowerCase().includes(term) ||
          this.getArtistName(track.title).toLowerCase().includes(term) ||
          track.description.toLocaleLowerCase().includes(term),
      )
      .slice(0, 8);

    this.showResults = true;
  }

  openSearchResult(track: Track): void {
    this.showResults = false;
    this.searchTerm = '';

    this.openEpisode(track.slug);
  }

  loadTracks() {
    this.podcastService.getTracks().subscribe((res) => {
      this.tracks = res.data;
      this.updatePage();
    });
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedTracks = this.tracks.slice(start, end);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePage();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  openEpisode(slug: string): void {
    window.location.href = `/episode/${slug}`;
  }
  formatDuration(seconds: string | number): string {
    const totalSeconds = Number(seconds);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  getArtistName(title: string): string {
    const match = title.match(/(?:by|-)\s*(.+)$/i);
    return match ? match[1].trim() : title;
  }
}
