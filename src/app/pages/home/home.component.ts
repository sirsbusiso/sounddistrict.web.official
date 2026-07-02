import { Component, HostListener } from '@angular/core';
import { HeroComponent } from '../../shared/hero/hero.component';
import { MerchComponent } from '../merch/merch.component';
import { SubscribeComponent } from '../subscribe/subscribe.component';
import { ContactComponent } from '../contact/contact.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadDialogComponent } from '../../shared/upload-dialog/upload-dialog.component';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    MerchComponent,
    SubscribeComponent,
    ContactComponent,
    CommonModule,
    UploadDialogComponent,
    AboutComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showUploadPopup = false;

  private popupShown = false;

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onScroll() {
    if (this.popupShown) {
      return;
    }

    const trigger = document.body.scrollHeight * 0.5;

    if (window.scrollY + window.innerHeight >= trigger) {
      this.popupShown = false;

      this.showUploadPopup = false;
    }
  }

  closePopup() {
    this.showUploadPopup = false;
  }

  continueUpload() {
    this.showUploadPopup = false;

    this.router.navigate(['/upload']);
  }
}
