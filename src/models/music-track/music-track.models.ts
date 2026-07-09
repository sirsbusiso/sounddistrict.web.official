export interface MusicTrack {
  id: string;
  musicReleaseId: string;
  trackNumber: number;
  slug: string;
  title: string;
  version?: string;
  durationSeconds: number;
  bpm?: number;
  musicalKey?: string;
  previewUrl?: string;
  mp3Key?: string;
  wavKey?: string;
  price: number;
  genre: string;
  isActive: boolean;
  downloads?: number;
  previews?: number;
}
