import { Component } from '@angular/core';
import { MusicTrack } from '../../../models/music-track/music-track.models';
import { PlayerService } from '../../../services/shared/player.service';
import { Track } from '../../../models/podcast/podcast.models';
import { release } from 'os';
import { MusicReleaseService } from '../../../services/music-release.service/music-release.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicRelease } from '../../../models/music-release/music-release.models';

import { CommonModule } from '@angular/common';
import { MusicTrackService } from '../../../services/music-track.service/music-track.service';
import { ShareService } from '../../../services/shared/share.service';
import { PurchaseService } from '../../../services/shared/purchase.service';
import { ReleaseType } from '../../../models/shared/shared.models';
import { Purchase } from '../../../models/shared/purchase.models';

@Component({
  selector: 'app-view-release',
  imports: [CommonModule],
  templateUrl: './view-release.component.html',
  styleUrl: './view-release.component.css',
})
export class ViewReleaseComponent {
  playerTrack?: Track;
  releaseId = '';
  musicRelease?: MusicRelease;
  playing = false;
  ReleaseType = ReleaseType;
  relatedReleases: MusicRelease[] = [];
  slug = '';
  previewCount = 0;
  purchase?: Purchase;

  constructor(
    private playerService: PlayerService,
    private musicReleaseService: MusicReleaseService,
    private musicTrackService: MusicTrackService,
    private route: ActivatedRoute,
    private shareService: ShareService,
    private router: Router,
    private purchaseService: PurchaseService,
  ) {}

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug')!;
    this.playerService.currentTrack$.subscribe((track) => {
      this.playerTrack = track!;
    });

    this.playerService.isPlaying$.subscribe((isPlaying) => {
      this.playing = isPlaying;
    });
    this.playerService.previewCount$.subscribe((previews) => {
      this.previewCount = previews;
    });
    this.getRelease();
  }

  getRelease() {
    this.musicReleaseService.getBySlug(this.slug).subscribe({
      next: (response) => {
        if (response) {
          this.musicRelease = response.data;
        }
      },
    });
  }

  getPreviewCount(track: MusicTrack) {
    this.previewCount = track.previews!;
    return this.previewCount;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${minutes}:${remaining.toString().padStart(2, '0')}`;
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  play(track: MusicTrack) {
    this.playerTrack = {
      artworkUrl: this.musicRelease?.artworkUrl!,
      bpm: String(track.bpm),
      createdAt: String(this.musicRelease?.createdAt),
      description: this.musicRelease?.description!,
      dominantColor: this.musicRelease?.dominantColor!,
      downloads: 0,
      duration: Number(this.formatDuration(track.durationSeconds)),
      downloadUrl: '',
      genre: track.genre,
      key: track.musicalKey!,
      streamUrl: track.previewUrl!,
      slug: track.slug,
      permalinkUrl: '',
      plays: this.previewCount + 1,
      title: track.title,
      releaseId: this.musicRelease?.id,
      artistName: this.musicRelease?.artistName,
      isMusic: true,
    };
    this.playerService.toggle(this.playerTrack);
    this.increasePreviews(track);
    this.getPreviewCount(track);
  }

  async shareRelease(release: MusicRelease): Promise<void> {
    try {
      var description = `Buy ${release.title} exclusively on Sound District.`;
      this.shareService.shareEpisode(release.slug, release.title, description);
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  increasePreviews(track: MusicTrack) {
    this.musicTrackService.increasePreviews(track.id).subscribe({
      next: (respone) => {
        if (respone) {
          if (this.isPlaying(track)) {
            track.previews = track.previews! + 1;
            this.playerService.updatePreview(track.previews!);
          }
        }
      },
    });
  }

  getRelatedReleases(): void {
    this.musicReleaseService.getAll().subscribe({
      next: (response) => {
        if (response) {
          this.relatedReleases = response.data
            .filter((r) => r.id !== this.releaseId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        }
      },
    });
  }

  isPlaying(track: MusicTrack): boolean {
    this.playerTrack = {
      artworkUrl: this.musicRelease?.artworkUrl!,
      bpm: String(track.bpm),
      createdAt: String(this.musicRelease?.createdAt),
      description: this.musicRelease?.description!,
      dominantColor: this.musicRelease?.dominantColor!,
      downloads: 0,
      duration: Number(this.formatDuration(track.durationSeconds)),
      downloadUrl: '',
      genre: track.genre,
      key: track.musicalKey!,
      streamUrl: track.previewUrl!,
      slug: track.slug,
      permalinkUrl: '',
      title: track.title,
      isMusic: true,
      plays: this.previewCount + 1,
    };
    return (
      this.playerService.currentTrack?.streamUrl ===
        this.playerTrack.streamUrl && this.playerService.isPlaying
    );
  }

  countTracks(tracks: MusicTrack[] | undefined): number {
    return tracks?.length ?? 0;
  }

  buyRelease(release: MusicRelease): void {
    this.purchaseService.buyRelease({
      id: release.id,
      title: release.title,
      artistName: release.artistName,
      artworkUrl: release.artworkUrl!,
      releaseType: release.releaseType,
      price: release.price,
    });
  }

  buyTrack(track: MusicTrack): void {
    this.purchaseService.buyTrack({
      id: track.id,
      title: track.title,
      artistName: this.musicRelease?.artistName!,
      artworkUrl: this.musicRelease?.artworkUrl!,
      price: track.price,
    });
  }
}
