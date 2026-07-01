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
];
