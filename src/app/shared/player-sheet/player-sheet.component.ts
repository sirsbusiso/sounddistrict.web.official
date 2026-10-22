import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../services/shared/player.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-sheet',
  imports: [CommonModule],
  templateUrl: './player-sheet.component.html',
  styleUrls: ['./player-sheet.component.css'],
})
export class PlayerSheetComponent {
  sliderValue = 0;
  dragging = false;

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
  }

  onSeek(): void {
    this.dragging = false;
    this.player.seek(this.sliderValue);
  }

  formatTime(seconds: number | null): string {
    if (!seconds || isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  close(): void {
    this.player.collapse();
  }

  openEpisode(slug: string): void {
    this.router.navigate(['/episodes', slug]);
  }

  onSubtitleClick(track: any): void {
    // TODO
  }

  downloadTrack(track: any): void {
    // TODO
  }

  shareTrack(track: any): void {
    // TODO
  }
}
