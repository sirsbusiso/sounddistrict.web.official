import { Component } from '@angular/core';
import { PlayerService } from '../../../services/shared/player.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Track } from '../../../models/podcast/podcast.models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent {
  isMusic = false;
  previewCount = 0;
  constructor(
    public player: PlayerService,
    private router: Router,
  ) {
    this.player.currentTime$.subscribe((time) => {
      if (!this.dragging) {
        this.sliderValue = time;
      }
    });
    this.player.currentTrack$.subscribe((track) => {
      this.isMusic = track?.isMusic!;
    });
    player.previewCount$.subscribe((previews) => {
      this.previewCount = previews;
    });
  }

  isExpanded = false;
  private destroy$ = new Subject<void>();
  private lastTouchEnd = 0;

  dragging = false;
  sliderValue = 0;

  ngOnInit(): void {
    this.player.currentTime$
      .pipe(takeUntil(this.destroy$))
      .subscribe((time) => {
        if (!this.dragging) {
          this.sliderValue = time;
        }
      });

    this.player.currentTrack$
      .pipe(takeUntil(this.destroy$))
      .subscribe((track) => {
        this.isMusic = track?.isMusic ?? false;
      });

    this.player.previewCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((previews) => {
        this.previewCount = previews;
      });
  }

  onSeek() {
    this.dragging = false;
    this.player.seek(this.sliderValue);
  }

  preventDoubleTapZoom(event: TouchEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('button')) {
      return;
    }

    const now = Date.now();

    if (now - this.lastTouchEnd < 300) {
      event.preventDefault();
    }

    this.lastTouchEnd = now;
  }

  togglePlayer(): void {
    this.isExpanded = !this.isExpanded;
  }

  formatTime(seconds: number | null): string {
    if (seconds == null || isNaN(seconds)) {
      return '00:00';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  openEpisode(slug: string): void {
    this.player.collapse();

    this.router.navigate(['/episode', slug]);
  }

  openArtist(releaseId: string) {
    this.router.navigate(['/release', releaseId]);
  }
  onSubtitleClick(track: Track): void {
    if (track.releaseId) {
      this.openArtist(track.releaseId!);
    } else {
      this.openEpisode(track.slug);
    }
  }
  async shareTrack(track: Track): Promise<void> {
    const url = `${window.location.origin}/episode/${track.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: `Listen to ${track.title} on Sound District.`,
          url,
        });

        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);

    alert('Episode link copied to clipboard.');
  }
  downloadTrack(track: Track): void {
    if (!track.downloadUrl) {
      return;
    }

    window.open(track.downloadUrl, '_blank');
  }

  openPlayer(): void {
    if (window.innerWidth <= 768) {
      this.player.expand();
    }
  }

  closePlayer(): void {
    this.player.collapse();
  }
}
