import { Component } from '@angular/core';
import { PlayerService } from '../../../services/shared/player.service';
import { PodcastService } from '../../../services/podcast.service/podcast.service';
import { Router } from '@angular/router';
import { CommonModule, SlicePipe } from '@angular/common';

@Component({
    selector: 'app-podcasts',
    imports: [SlicePipe, CommonModule],
    templateUrl: './podcasts.component.html',
    styleUrl: './podcasts.component.css'
})
export class PodcastsComponent {
  tracks: any[] = [];
  pagedTracks: any[] = [];

  currentPage = 1;
  pageSize = 5;

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
    this.router.navigate(['/episode', slug]);
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
}
