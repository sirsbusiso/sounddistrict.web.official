import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  setCookie(name: string, value: string, days = 7): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();

    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
  }

  getCookie(name: string): string | null {
    const cookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith(name + '='));

    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}
