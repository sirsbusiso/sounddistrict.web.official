import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../../models/podcast/podcast.models';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private audio = new Audio();

  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject(0);
  duration$ = this.durationSubject.asObservable();

  constructor() {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.audio.duration);
    });

    this.audio.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
    });
  }

  play(track: Track) {
    if (this.audio.src !== track.streamUrl) {
      this.audio.src = track.streamUrl;

      this.currentTrackSubject.next(track);
    }

    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  toggle(track: Track) {
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

  seek(value: number) {
    this.audio.currentTime = value;
  }
}
