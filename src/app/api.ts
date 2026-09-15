import type { Locale } from '../i18n/translations'

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { credentials: 'include', headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }, ...options })
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error || 'REQUEST_FAILED') }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const localizedUrl = (path: string, locale: Locale) => `${path}${path.includes('?') ? '&' : '?'}locale=${locale}`
