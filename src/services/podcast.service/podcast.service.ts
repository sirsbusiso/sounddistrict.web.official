import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../models/shared/api.response';
import { Track } from '../../models/podcast/podcast.models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PodcastService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Mixes`;
  constructor() {}

  getTracks(): Observable<ApiResponse<Track[]>> {
    return this.http.get<ApiResponse<Track[]>>(
      `${this.baseUrl}/GetAllEpisodes`,
    );
  }
  getTrack(slug: string): Observable<Track> {
    return this.http.get<Track>(`${this.baseUrl}/GetEpisodeBySlug/${slug}`);
  }
}
