import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../models/shared/api.response';
import { environment } from '../../../environments/environment';
import { Unsubscribe } from '../../../models/subcription/subscription.models';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/subscription`;

  subscribeToLists(email: string) {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/subscribe`, {
      email,
    });
  }

  unsubscribeFromLists(request: Unsubscribe) {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/unsubscribe`,
      request,
    );
  }
}
