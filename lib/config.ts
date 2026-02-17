const defaultLocalApi = 'http://localhost:8080/api';
export const WEB_API_URL =
  process.env.WEB_API_URL ?? (process.env.NODE_ENV === 'development' ? defaultLocalApi : '');
export const TOKEN_COOKIE = 'edo_admin_token';

export function requireApiBaseUrl(): string {
  if (!WEB_API_URL) {
    throw new Error('WEB_API_URL is not configured');
  }
  return WEB_API_URL;
}
