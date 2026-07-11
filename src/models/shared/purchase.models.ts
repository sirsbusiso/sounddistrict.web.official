import { ReleaseType } from './shared.models';

export interface PurchaseRelease {
  id: string;
  title: string;
  artistName: string;
  artworkUrl: string;
  releaseType: ReleaseType;
  slug: string;
  price: number;
}

export interface PurchaseTrack {
  id: string;
  releaseId: string;
  title: string;
  artistName: string;
  artworkUrl: string;
  slug: string;
  price: number;
}

export interface Purchase {
  releases: PurchaseRelease[];
  tracks: PurchaseTrack[];
}
