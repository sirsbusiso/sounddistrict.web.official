import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MusicCheckoutRequest } from '../../models/purchase/purchase.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MusicPurchaseService {
  private api = `${environment.apiUrl}/MusicPurchase`;

  constructor(private http: HttpClient) {}

  checkout(request: MusicCheckoutRequest): Observable<any> {
    return this.http.post<any>(`${this.api}/checkout`, request);
  }

  getPurchase(uniqueId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${uniqueId}`);
  }

  getPurchases(email: string): Observable<any> {
    return this.http.get<any>(`${this.api}/customer/${email}`);
  }

  customerOwnsTrack(email: string, trackId: string): Observable<any> {
    return this.http.get<any>(
      `${this.api}/owns-track?email=${encodeURIComponent(email)}&trackId=${trackId}`,
    );
  }
}
