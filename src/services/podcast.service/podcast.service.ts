import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../models/shared/api.response';
import { Track } from '../../models/podcast/podcast.models';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PodcastService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Mixes`;
  constructor() {}

  private tracks$?: Observable<ApiResponse<Track[]>>;

  getTracks(): Observable<ApiResponse<Track[]>> {
    if (!this.tracks$) {
      this.tracks$ = this.http
        .get<ApiResponse<Track[]>>(`${this.baseUrl}/GetAllEpisodes`)
        .pipe(shareReplay(1));
    }

    return this.tracks$;
  }
  getTrack(slug: string): Observable<Track | undefined> {
    return this.getTracks().pipe(
      map((response) => response.data.find((x) => x.slug === slug)),
    );
  }
}
