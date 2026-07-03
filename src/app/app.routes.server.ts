import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },

  {
    path: 'podcasts',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'donate',
    renderMode: RenderMode.Prerender,
  },

  {
    path: 'episode/:slug',
    renderMode: RenderMode.Server,
  },

  {
    path: 'upload',
    renderMode: RenderMode.Server,
  },

  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
