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
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, StatsComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit, OnDestroy {
  tracks: Track[] = [];
  currentTrack = 0;

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private destroy$ = new Subject<void>();
  totalEpisodes = 0;
  totalArtists = 0;
  totalHours = 0;
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

  private getPodcasts(): void {
    this.podcastService
      .getTracks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.tracks = response.data ?? [];

            // Statistics
            this.totalEpisodes = this.tracks.length;

            const artists = new Set<string>();

            const totalDuration = this.tracks.reduce((total, track) => {
              const artist = this.getArtistName(track.title)
                .trim()
                .toLowerCase();

              if (artist) {
                artists.add(artist);
              }

              return total + Number(track.duration ?? 0);
            }, 0);

            this.totalHours = Math.round(totalDuration / 3600);
            this.totalArtists = artists.size;
            this.totalEpisodes = this.tracks.length;

            this.totalArtists = artists.size;

            if (isPlatformBrowser(this.platformId) && this.tracks.length > 1) {
              this.startSlider();
            }
          }
        },
        error: (err) => {
          console.error('Failed to load podcasts:', err);

          this.tracks = [];
          this.totalEpisodes = 0;
          this.totalArtists = 0;
          this.totalHours = 0;
        },
      });
  }

  private getArtistName(title: string): string {
    // Mixed by ...
    const mixedByMatch = title.match(/mixed by\s+(.+)$/i);
    if (mixedByMatch) {
      return mixedByMatch[1].trim();
    }

    // Everything after the last dash
    const dashIndex = title.lastIndexOf(' - ');
    if (dashIndex !== -1) {
      return title.substring(dashIndex + 3).trim();
    }

    return '';
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
}
