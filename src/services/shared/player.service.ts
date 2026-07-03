import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../../models/podcast/podcast.models';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly platformId = inject(PLATFORM_ID);

  private audio: HTMLAudioElement | null = null;

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

  private playerBackgroundSubject = new BehaviorSubject(
    'linear-gradient(180deg, #111 0%, #111 100%)',
  );

  playerBackground$ = this.playerBackgroundSubject.asObservable();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.audio = new Audio();

    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio!.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.audio!.duration);
    });

    this.audio.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
    });
  }

  play(track: Track): void {
    const audio = this.getAudio();
    const start = performance.now();

    if (!audio) {
      return;
    }

    if (audio.src !== track.streamUrl) {
      audio.src = track.streamUrl;
      this.currentTrackSubject.next(track);
    }
    this.updateMediaSession(track);
    if (window.innerWidth <= 768) {
      this.expand();
    }

    audio.play();
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
      audio.play();
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
  }

  private getAudio(): HTMLAudioElement | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    if (!this.audio) {
      this.audio = new Audio();
    }

    return this.audio;
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
  skipForward(seconds: number): void {
    const audio = this.getAudio();

    if (!audio) {
      return;
    }

    audio.currentTime = Math.min(audio.currentTime + seconds, audio.duration);
  }

  skipBackward(seconds: number): void {
    const audio = this.getAudio();

    if (!audio) {
      return;
    }

    audio.currentTime = Math.min(audio.currentTime - seconds, audio.duration);
  }

  private updateMediaSession(track: Track): void {
    if (!('mediaSession' in navigator)) {
      return;
    }

    const audio = this.getAudio();

    if (!audio) {
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
  }
}
