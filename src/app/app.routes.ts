import { Routes } from '@angular/router';
import { PodcastsComponent } from './pages/podcasts/podcasts.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'episode/:slug',
    loadComponent: () =>
      import('./pages/episode/episode.component').then(
        (m) => m.EpisodeComponent,
      ),
  },
  {
    path: 'podcasts',
    loadComponent: () =>
      import('./pages/podcasts/podcasts.component').then(
        (m) => m.PodcastsComponent,
      ),
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./pages/upload/upload.component').then((m) => m.UploadComponent),
  },
  {
    path: 'donate',
    loadComponent: () =>
      import('./pages/donate/donate.component').then((m) => m.DonateComponent),
  },
  {
    path: 'music',
    loadComponent: () =>
      import('./pages/music/music.component').then((m) => m.MusicComponent),
  },
  {
    path: 'release/:slug',
    loadComponent: () =>
      import('./pages/view-release/view-release.component').then(
        (m) => m.ViewReleaseComponent,
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (m) => m.CheckoutComponent,
      ),
  },
  {
    path: 'payment/:status',
    loadComponent: () =>
      import('./shared/payment-result/payment-result.component').then(
        (m) => m.PaymentResultComponent,
      ),
  },
];
