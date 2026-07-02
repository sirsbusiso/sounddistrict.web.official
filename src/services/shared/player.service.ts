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

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.audio) {
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

    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
      this.currentTimeSubject.next(0);
    });
  }

  play(track: Track): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initializeAudio();

    if (!this.audio) {
      return;
    }

    if (this.audio.src !== track.streamUrl) {
      this.audio.src = track.streamUrl;
      this.currentTrackSubject.next(track);
    }

    this.audio.play();
  }

  pause(): void {
    if (!this.audio) {
      return;
    }

    this.audio.pause();
  }

  toggle(track: Track): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initializeAudio();

    if (!this.audio) {
      return;
    }

    const current = this.currentTrackSubject.value;

    if (!current || current.streamUrl !== track.streamUrl) {
      this.play(track);
      return;
    }

    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  seek(value: number): void {
    if (!this.audio) {
      return;
    }

    this.audio.currentTime = value;
  }

  stop(): void {
    if (!this.audio) {
      return;
    }

    this.audio.pause();
    this.audio.currentTime = 0;

    this.currentTrackSubject.next(null);
    this.currentTimeSubject.next(0);
    this.isPlayingSubject.next(false);
  }
}
