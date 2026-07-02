import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EmailRequest } from '../../models/contact/contact.models';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/email`;

  sendEmail(email: EmailRequest) {
    return this.http.post(`${this.baseUrl}/sendEmail`, email);
  }
}
