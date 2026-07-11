import { Component } from '@angular/core';
import { BagAnimationService } from '../../../services/shared/bag.animation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bag-animation',
  imports: [CommonModule],
  templateUrl: './bag-animation.component.html',
  styleUrl: './bag-animation.component.css',
})
export class BagAnimationComponent {
  visible = false;

  artwork = '';

  left = 0;
  top = 0;

  constructor(private bagAnimation: BagAnimationService) {}

  ngOnInit() {
    this.bagAnimation.artwork$.subscribe((image) => {
      const bag = this.bagAnimation
        .getBagElement()
        ?.nativeElement.getBoundingClientRect();

      if (bag) {
        this.left = bag.left + bag.width / 2 - 28;
        this.top = bag.top - 70;
      }

      this.artwork = image;

      this.visible = true;

      setTimeout(() => {
        this.visible = false;
      }, 1300);
    });
  }
}
