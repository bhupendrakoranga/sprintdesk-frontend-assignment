const DEFAULT_AUTH_BASE_URL = 'https://dummyjson.com/auth'

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export const env = {
  authBaseUrl: trimTrailingSlash(import.meta.env.VITE_AUTH_BASE_URL ?? DEFAULT_AUTH_BASE_URL),
}
