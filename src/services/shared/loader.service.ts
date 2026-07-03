import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private requests = 0;

  private loadingSubject = new BehaviorSubject(false);

  loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.requests++;

    this.loadingSubject.next(true);
  }

  hide(): void {
    this.requests--;

    if (this.requests <= 0) {
      this.requests = 0;

      this.loadingSubject.next(false);
    }
  }
}
