import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Track } from '../../../models/podcast/podcast.models';
import { PodcastService } from '../../../services/podcast.service/podcast.service';
import { PlayerService } from '../../../services/shared/player.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit, OnDestroy {
  tracks: Track[] = [];
  currentTrack = 0;
  totalEpisodes = 0;
  totalArtists = 0;
  totalHours = 24;
  streamingLabel = '24/7';
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private podcastService: PodcastService,
    public player: PlayerService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.getPodcasts();
  }

  goToEpisode(track: Track): void {
    this.router.navigate(['/episode', track.slug]);
  }
  private calculateStats(): void {
    // Episodes
    this.totalEpisodes = this.tracks.length;

    // Artists from title
    const artists = this.tracks
      .map((track) => {
        const match = track.title.match(/Mixed by (.+)$/i);
        return match ? match[1].trim() : null;
      })
      .filter((artist): artist is string => !!artist);

    this.totalArtists = new Set(artists).size;

    // Total hours
    const totalSeconds = this.tracks.reduce(
      (sum, track) => sum + Number(track.duration),
      0,
    );

    this.totalHours = Math.round(totalSeconds / 3600);
  }

  formatTime(duration: string | number | null | undefined): string {
    if (duration == null) {
      return '00:00';
    }

    const totalSeconds = Number(duration);

    if (isNaN(totalSeconds)) {
      return '00:00';
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m ${seconds}s`;
  }

  getEpisodeNumber(title: string): string {
    const match = title.match(/#(\d+)/);

    return match ? match[1] : '';
  }
  private getPodcasts(): void {
    this.podcastService
      .getTracks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.tracks = response.data ?? [];

            this.calculateStats();

            if (isPlatformBrowser(this.platformId) && this.tracks.length > 1) {
              this.startSlider();
            }
            if (isPlatformBrowser(this.platformId) && this.tracks.length > 1) {
              this.startSlider();
            }
          }
        },
        error: (err) => {
          console.error('Failed to load podcasts:', err);
          this.tracks = [];
        },
      });
  }

  private startSlider(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 7000);
  }

  nextSlide(): void {
    this.player.setBackPlayerBackground();
    if (!this.tracks.length) return;

    this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
  }

  previousSlide(): void {
    this.player.setBackPlayerBackground();
    if (!this.tracks.length) return;

    this.currentTrack =
      (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  goToEpisodes() {
    this.router.navigate(['/podcasts']);
  }
}
