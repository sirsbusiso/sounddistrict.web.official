import { MusicTrack } from '../music-track/music-track.models';

export interface UpdateMusicReleaseRequest {
  title: string;
  description?: string;
  releaseType: number;
  artistName: string;
  labelName?: string;
  genre?: string;
  subGenre?: string;
  catalogNumber?: string;
  price: number;
  publishAt?: Date;
}

export interface MusicRelease {
  id: string;
  title: string;
  slug: string;
  description?: string;
  dominantColor: string;
  releaseType: number;

  artistName: string;
  labelName?: string;

  genre?: string;
  subGenre?: string;

  catalogNumber?: string;

  artworkKey?: string;
  artworkUrl?: string;

  price: number;

  status: number;

  isActive: boolean;
  publishDate: Date;
  scheduleDate: Date;
  createdAt: Date;
  isPublished: boolean;
  releaseDate: Date;
  updatedAt?: Date;
  tracks?: MusicTrack[];
}
export interface UpdateArtworkKeyRequest {
  artworkKey: string;
}

export interface UpdateZipKeyRequest {
  zipKey: string;
}
