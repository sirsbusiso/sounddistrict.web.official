import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ProductDto } from '../../models/merch/merch.models';
import { ApiResponse } from '../../models/shared/api.response';

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
}
