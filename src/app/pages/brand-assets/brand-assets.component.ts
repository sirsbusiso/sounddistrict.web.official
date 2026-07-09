import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-brand-assets',
  imports: [CommonModule],
  templateUrl: './brand-assets.component.html',
  styleUrl: './brand-assets.component.css',
})
export class BrandAssetsComponent {
  logos = [
    { name: '', file: 'yoco.svg' },
    { name: '', file: 'amex.svg' },
    { name: '', file: 'visa.svg' },
    { name: '', file: 'mastercard.svg' },
    { name: '', file: 'applepay.svg' },
    { name: '', file: 'googlepay.svg' },
  ];
}
