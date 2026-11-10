import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductDto } from '../../../models/merch/merch.models';
import { ApiResponse } from '../../../models/shared/api.response';

@Injectable({
  providedIn: 'root',
})
export class MerchService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/product`;

  private productIdStore = new BehaviorSubject<number | null>(null);
  productId$ = this.productIdStore.asObservable();

  getAllProducts() {
    return this.http.get<ApiResponse<ProductDto[]>>(
      `${this.baseUrl}/getAllProducts`,
    );
  }
  getOriginalImageBySlug(slug: string) {
    return this.http.get<{ imageUrl: string }>(
      `${this.baseUrl}/GetOriginalImageBySlug/${slug}`,
    );
  }
}
