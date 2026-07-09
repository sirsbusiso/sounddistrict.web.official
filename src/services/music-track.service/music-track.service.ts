import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../../models/shared/api.response';
import { MusicTrack } from '../../models/music-track/music-track.models';

@Injectable({
  providedIn: 'root',
})
export class MusicTrackService {
  private readonly endpoint = `${environment.apiUrl}/musictrack`;

  constructor(private http: HttpClient) {}

  get(id: string): Observable<ApiResponse<MusicTrack>> {
    return this.http.get<ApiResponse<MusicTrack>>(`${this.endpoint}/${id}`);
  }

  getByRelease(releaseId: string): Observable<ApiResponse<MusicTrack[]>> {
    return this.http.get<ApiResponse<MusicTrack[]>>(
      `${this.endpoint}/release/${releaseId}`,
    );
  }

  increaseDownlods(id: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.endpoint}/${id}/downloads`, {});
  }

  increasePreviews(id: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.endpoint}/${id}/previews`, {});
  }
}
