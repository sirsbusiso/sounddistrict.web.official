import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Track } from '../../../models/podcast/podcast.models';
import { PodcastService } from '../../../services/podcast.service/podcast.service';
import { PlayerService } from '../../../services/shared/player.service';

@Component({
  selector: 'app-episode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode.component.html',
  styleUrl: './episode.component.css',
})
export class EpisodeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  constructor(
    private podcastService: PodcastService,
    public player: PlayerService,
  ) {}

  track!: Track;

  relatedTracks: Track[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadEpisode();
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

  loadEpisode(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      console.error('Episode slug not found');

      return;
    }

    this.podcastService.getTrack(slug).subscribe({
      next: (response) => {
        this.track = response;

        this.loading = false;

        this.loadRelated();
      },

      error: (error) => {
        console.error(error);

        this.loading = false;
      },
    });
  }

  async shareEpisode(track: any): Promise<void> {
    const url = `${window.location.origin}/episode/${track.slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: track.title,
          text: `🎧 ${track.title}\n\nListen now on Sound District.`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Episode link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  loadRelated(): void {
    this.podcastService.getTracks().subscribe({
      next: (response) => {
        const tracks = response.data.filter(
          (x) => x.title !== this.track.title,
        );

        this.shuffle(tracks);

        this.relatedTracks = tracks.slice(0, 5);
      },
    });
  }

  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  openEpisode(slug: string): void {
    window.location.href = `/episode/${slug}`;
  }
}
