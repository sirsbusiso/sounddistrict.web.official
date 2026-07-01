import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Track } from '../../../models/podcast/podcast.models';
import { PodcastService } from '../../../services/podcast.service/podcast.service';
import { PlayerService } from '../../../services/shared/player.service';
import { Router } from '@angular/router';

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

  private intervalId: any;

  constructor(
    private podcastService: PodcastService,
    public player: PlayerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getPodcasts();
  }

  goToEpisode(track: Track): void {
    this.router.navigate(['/episode', track.slug]);
  }

  getPodcasts(): void {
    this.podcastService.getTracks().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.tracks = response.data;

          this.startSlider();
        }
      },

      error: (err) => console.error(err),
    });
  }

  startSlider(): void {
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
    clearInterval(this.intervalId);
  }
}
