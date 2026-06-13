import { AppConfig } from './app-config.token';

export async function loadAppConfig(): Promise<AppConfig> {
  const response = await fetch('/app-config.json');
  return response.json();
}
