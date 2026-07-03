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

  private getPodcasts(): void {
    this.podcastService
      .getTracks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.tracks = response.data ?? [];
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
    if (!this.tracks.length) return;

    this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
  }

  previousSlide(): void {
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

  getDominantColor(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject('Canvas not supported');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < pixels.length; i += 40) {
          const pr = pixels[i];
          const pg = pixels[i + 1];
          const pb = pixels[i + 2];
          const alpha = pixels[i + 3];

          if (alpha < 128) continue;

          r += pr;
          g += pg;
          b += pb;
          count++;
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        resolve(`rgb(${r}, ${g}, ${b})`);
      };

      img.onerror = reject;
      img.src = imageUrl;
    });
  }
}
