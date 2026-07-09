import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/shared/api.response';
import {
  MusicRelease,
  UpdateMusicReleaseRequest,
} from '../../models/music-release/music-release.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MusicReleaseService {
  private baseUrl = `${environment.apiUrl}/MusicRelease`;

  constructor(private http: HttpClient) {}

  get(id: string): Observable<ApiResponse<MusicRelease>> {
    return this.http.get<ApiResponse<MusicRelease>>(`${this.baseUrl}/${id}`);
  }

  getBySlug(slug: string): Observable<ApiResponse<MusicRelease>> {
    return this.http.get<ApiResponse<MusicRelease>>(`${this.baseUrl}/${slug}`);
  }

  getAll(): Observable<ApiResponse<MusicRelease[]>> {
    return this.http.get<ApiResponse<MusicRelease[]>>(this.baseUrl);
  }
}
