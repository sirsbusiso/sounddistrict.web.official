import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Track } from '../../../models/podcast/podcast.models';
import { PodcastService } from '../../../services/podcast.service/podcast.service';
import { PlayerService } from '../../../services/shared/player.service';
import { SeoService } from '../../../services/shared/seo.service';

@Component({
  selector: 'app-episode',
  imports: [CommonModule],
  templateUrl: './episode.component.html',
  styleUrl: './episode.component.css',
})
export class EpisodeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  constructor(
    private podcastService: PodcastService,
    public player: PlayerService,
    private router: Router,
    private seo: SeoService,
  ) {}

  track?: Track;

  relatedTracks: Track[] = [];
  artistRelated: Track[] = [];

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

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  getArtistName(title: string): string {
    const match = title.match(/(?:by|-)\s*(.+)$/i);
    return match ? match[1].trim() : title;
  }

  loadEpisode(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (!slug) {
        console.error('Episode slug not found');
        return;
      }

      this.loading = true;

      this.podcastService.getTrack(slug).subscribe({
        next: (response) => {
          this.track = response;
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });

          this.loading = false;

          this.seo.update({
            title: `${this.track?.title} ?? Sound District`,
            description: this.track?.description,
            image: this.track?.artworkUrl,
            url: `https://sounddistrict.co.za/episode/${this.track?.slug}`,
            keywords: 'Deep House, Soulful House, Afro House, Podcast, DJ Mix',
            type: 'music.song',
          });

          this.loadRelated();
          this.loadRelatedArtist();
        },
        error: (error) => {
          console.error(error);
          this.loading = false;
        },
      });
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
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  loadRelated(): void {
    this.podcastService.getTracks().subscribe({
      next: (response) => {
        const tracks = response.data.filter(
          (x) => x.title !== this.track?.title,
        );

        this.shuffle(tracks);

        this.relatedTracks = tracks.slice(0, 5);
      },
    });
  }
  loadRelatedArtist() {
    this.podcastService.getTracks().subscribe({
      next: (response) => {
        const currentArtist = this.getArtistName(this.track!.title);

        const tracks = response.data.filter(
          (x) =>
            x.slug !== this.track?.slug &&
            this.getArtistName(x.title) === currentArtist,
        );

        this.shuffle(tracks);
        if (!this.isMobile()) {
          this.artistRelated = tracks.slice(0, 5);
        } else {
          this.artistRelated = tracks.slice(0, 3);
        }
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
    console.log(slug);
    this.router.navigate(['/episode', slug]);
  }
  viewAllEpisodes(): void {
    this.router.navigate(['/podcasts']);
  }

  downloadTrack(track: Track): void {
    window.open(track.downloadUrl, '_blank', 'noopener,noreferrer');
  }
}
