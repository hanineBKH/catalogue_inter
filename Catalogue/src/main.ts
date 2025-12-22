import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
});
enableProdMode();
