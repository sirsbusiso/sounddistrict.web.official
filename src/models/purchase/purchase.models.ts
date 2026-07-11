export interface MusicCheckoutRequest {
  fullName: string;
  email: string;
  items: MusicCheckoutItem[];
}

export interface MusicCheckoutItem {
  musicReleaseId?: string;
  musicTrackId?: string;
}
