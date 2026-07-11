import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BagAnimationService {
  private subject = new Subject<string>();

  private bagElement?: ElementRef;

  setBagElement(element: ElementRef) {
    this.bagElement = element;
  }

  getBagElement(): ElementRef | undefined {
    return this.bagElement;
  }

  artwork$ = this.subject.asObservable();

  show(artwork: string) {
    this.subject.next(artwork);
  }
}
