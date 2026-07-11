import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../../../services/shared/purchase.service';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css'],
})
export class PaymentResultComponent implements OnInit {
  success = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
  ) {}

  ngOnInit(): void {
    const status = this.route.snapshot.paramMap.get('status');

    this.success = status === 'success';
    if (this.success) {
      this.purchaseService.clear();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/music']);
  }

  viewPurchases(): void {
    this.router.navigate(['/purchases']);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
