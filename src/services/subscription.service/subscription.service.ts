import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../models/shared/api.response';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/subscription`;

  subscribeToNewsletter(email: string) {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/subscribe`, {
      email,
    });
  }
}
