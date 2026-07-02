import { Component } from '@angular/core';
import { MerchService } from '../../../services/merch.service/merch.service';
import { ProductDto } from '../../../models/merch/merch.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merch.component.html',
  styleUrl: './merch.component.css',
})
export class MerchComponent {
  merch: ProductDto[] = [];
  constructor(private merchService: MerchService) {}

  ngOnInit(): void {
    this.loadMerch();
  }

  loadMerch(): void {
    this.merchService.getAllProducts().subscribe({
      next: (response) => {
        const products = [...response.data];

        this.shuffle(products);

        this.merch = products.slice(0, 2);
      },
    });
  }

  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  gotoProductDetails(slug: string): void {
    window.open(`https://shop.sounddistrict.co.za/product/${slug}`, '_blank');
  }
}
