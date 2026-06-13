import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideAppConfig } from './app/core/config/app-config.token';
import { loadAppConfig } from './app/core/config/config-loader';

loadAppConfig().then(config => {
  bootstrapApplication(App, {
    providers: [...appConfig.providers, provideAppConfig(config)]
  }).then();
});
