import { apiFetch } from './client';

export function fetchProfile() {
  return apiFetch('/api/me');
}
