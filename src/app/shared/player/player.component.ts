import { Component } from '@angular/core';
import { PlayerService } from '../../../services/shared/player.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Track } from '../../../models/podcast/podcast.models';
@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent {
  constructor(
    public player: PlayerService,
    private router: Router,
  ) {}

  isExpanded = false;

  togglePlayer(): void {
    this.isExpanded = !this.isExpanded;
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  getPlayerBackground(track: Track): string {
    if (!this.isMobile()) {
      return '#6b6b6b';
    }

    return `linear-gradient(
    180deg,
    ${track.dominantColor || '#6b6b6b'} 0%,
    #6b6b6b 100%
  )`;
  }
  getPlayerBorder(): string {
    if (!this.isMobile()) {
      return '1px solid #6b6b6b';
    }

    return 'none';
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
}
