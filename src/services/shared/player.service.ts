import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../../models/podcast/podcast.models';
import { MusicTrack } from '../../models/music-track/music-track.models';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly platformId = inject(PLATFORM_ID);

  private audio: HTMLAudioElement | null = null;

  private wasPlayingBeforeInterrupt = false;
  private wasPageHidden = false;

  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject(0);
  duration$ = this.durationSubject.asObservable();

  private expandedSubject = new BehaviorSubject(false);
  expanded$ = this.expandedSubject.asObservable();

  private playerBackgroundSubject = new BehaviorSubject('#6b6b6b');
  playerBackground$ = this.playerBackgroundSubject.asObservable();

  private initialBackgroundSubject = new BehaviorSubject('#6b6b6b');
  initialBackground$ = this.initialBackgroundSubject.asObservable();

  private previewCountSubject = new BehaviorSubject(0);
  previewCount$ = this.previewCountSubject.asObservable();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initializeAudio();

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.wasPageHidden = true;
        return;
      }

      if (this.wasPageHidden) {
        this.wasPageHidden = false;
        this.tryResumePlayback();
      }
    });

    window.addEventListener('focus', () => {
      this.tryResumePlayback();
    });
  }

  isMobile(): boolean {
    return isPlatformBrowser(this.platformId) && window.innerWidth <= 768;
  }

  setPlayerBackground(track: Track): void {
    this.playerBackgroundSubject.next(this.getPlayerBackground(track));
    this.initialBackgroundSubject.next(this.getPlayerBackground(track));
  }
  setBackPlayerBackground(): void {
    this.initialBackgroundSubject.next('#6b6b6b');
  }
  getPlayerBackground(track: Track | null): string {
    if (!this.isMobile()) {
      return '#6b6b6b';
    }
    return `linear-gradient(
    180deg,
    ${track?.dominantColor || '#6b6b6b'} 0%,
    #6b6b6b 100%
  )`;
  }

  private updatePlayerBackground(track: Track): void {
    this.playerBackgroundSubject.next(this.getPlayerBackground(track));
    this.initialBackgroundSubject.next(this.getPlayerBackground(track));
  }
  getPlayerBorder(): string {
    return this.isMobile() ? 'none' : '1px solid #6b6b6b';
  }

  private initializeAudio(): void {
    this.audio = new Audio();

    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio!.currentTime);
      this.updatePositionState();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.audio!.duration || 0);
      this.updatePositionState();
    });

    this.audio.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
      this.wasPlayingBeforeInterrupt = true;
      this.updatePositionState();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);

      if (!this.audio!.ended) {
        this.wasPlayingBeforeInterrupt = true;
      }
    });

    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
      this.wasPlayingBeforeInterrupt = false;
    });

    this.audio.addEventListener('waiting', () => {});

    this.audio.addEventListener('playing', () => {});

    this.audio.addEventListener('stalled', () => {});

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error', e);
    });
  }

  play(track: Track): void {
    const audio = this.getAudio();

    if (!audio) {
      return;
    }

    const current = this.currentTrackSubject.value;
    const isNewTrack = !current || current.streamUrl !== track.streamUrl;

    this.currentTrackSubject.next(track);
    this.updatePlayerBackground(track);
    this.updateMediaSession(track);

    if (isNewTrack) {
      audio.src = track.streamUrl;
      this.currentTimeSubject.next(0);
      this.durationSubject.next(0);
    }
    if (window.innerWidth <= 768 && !track?.isMusic) {
      this.expand();
    }

    audio.play().catch((err) => {
      console.error('Playback failed', err);
    });
  }
  pause(): void {
    this.getAudio()?.pause();
  }

  toggle(track: Track): void {
    const audio = this.getAudio();

    if (!audio) {
      return;
    }

    const current = this.currentTrackSubject.value;

    if (!current || current.streamUrl !== track.streamUrl) {
      this.play(track);
      return;
    }

    if (audio.paused) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }

  seek(value: number): void {
    const audio = this.getAudio();

    if (!audio) {
      return;
    }

    audio.currentTime = value;
    this.updatePositionState();
  }

  skipForward(seconds: number): void {
    const audio = this.getAudio();

    if (!audio) {
      return;
    }

    audio.currentTime = Math.min(
      audio.currentTime + seconds,
      audio.duration || audio.currentTime,
    );

    this.updatePositionState();
  }

  skipBackward(seconds: number): void {
    const audio = this.getAudio();

    if (!audio) {
      return;
    }

    audio.currentTime = Math.max(audio.currentTime - seconds, 0);

    this.updatePositionState();
  }

  expand(): void {
    this.expandedSubject.next(true);
  }

  collapse(): void {
    this.expandedSubject.next(false);
  }

  toggleExpanded(): void {
    this.expandedSubject.next(!this.expandedSubject.value);
  }

  private getAudio(): HTMLAudioElement | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    if (!this.audio) {
      this.initializeAudio();
    }

    return this.audio;
  }

  private async tryResumePlayback(): Promise<void> {
    const audio = this.getAudio();

    if (!audio) {
      return;
    }

    if (!this.wasPlayingBeforeInterrupt) {
      return;
    }

    if (!audio.paused) {
      return;
    }

    try {
      await audio.play();
    } catch {
      // Browser requires user interaction.
    }
  }

  private updateMediaSession(track: Track): void {
    if (!('mediaSession' in navigator)) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: 'Sound District Music Show',
      album: 'Sound District Music Show',
      artwork: [
        {
          src: track.artworkUrl,
          sizes: '500x500',
          type: 'image/jpeg',
        },
      ],
    });

    this.updatePositionState();

    navigator.mediaSession.setActionHandler('play', () => {
      this.audio?.play().catch(() => {});
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      this.audio?.pause();
    });

    navigator.mediaSession.setActionHandler('seekforward', () => {
      this.skipForward(15);
    });

    navigator.mediaSession.setActionHandler('seekbackward', () => {
      this.skipBackward(15);
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null) {
        this.seek(details.seekTime);
      }
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      if (!this.audio) {
        return;
      }

      this.audio.pause();
      this.audio.currentTime = 0;

      this.currentTimeSubject.next(0);
      this.isPlayingSubject.next(false);

      this.updatePositionState();
    });
  }
  private updatePositionState(): void {
    if (
      !('mediaSession' in navigator) ||
      !('setPositionState' in navigator.mediaSession)
    ) {
      return;
    }

    const audio = this.getAudio();

    if (!audio) {
      return;
    }

    if (!isFinite(audio.duration) || audio.duration <= 0) {
      return;
    }

    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      position: audio.currentTime,
    });
  }

  get currentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  get isPlaying(): boolean {
    return this.isPlayingSubject.value;
  }

  updatePreview(count: number) {
    this.previewCountSubject.next(count);
  }
}
