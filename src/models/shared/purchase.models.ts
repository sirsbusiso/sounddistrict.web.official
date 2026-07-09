import { ReleaseType } from './shared.models';

export interface PurchaseRelease {
  id: string;
  title: string;
  artistName: string;
  artworkUrl: string;
  releaseType: ReleaseType;
  price: number;
}

export interface PurchaseTrack {
  id: string;
  title: string;
  artistName: string;
  artworkUrl?: string;
  price: number;
}

export interface Purchase {
  type: PurchaseType;
  release?: PurchaseRelease;
  tracks: PurchaseTrack[];
}

export enum PurchaseType {
  Release = 'release',
  Tracks = 'tracks',
}
