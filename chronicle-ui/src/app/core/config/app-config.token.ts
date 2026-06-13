import { InjectionToken, Provider } from '@angular/core';
import { AppStages } from '../types/app/app-stages.types';

export interface AppConfig {
  apiUrl: string;
  environment: AppStages;
  version: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('AppConfig');

export function provideAppConfig(config: AppConfig): Provider {
  return {
    provide: APP_CONFIG,
    useValue: config
  };
}
