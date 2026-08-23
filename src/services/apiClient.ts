import type { ApiErrorResponse } from '../types/global'
import { useAuthStore } from '../stores/authStore'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const getErrorMessage = async (response: Response) => {
  try {
    const errorData = (await response.clone().json()) as ApiErrorResponse
    return errorData.message ?? 'Something went wrong. Please try again.'
  } catch {
    return 'Something went wrong. Please try again.'
  }
}

export async function apiFetch<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  const request = (accessToken: string | null) => {
    const headers = new Headers(init.headers)

    headers.set('Accept', 'application/json')

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    return fetch(input, { ...init, headers })
  }

  let response = await request(useAuthStore.getState().accessToken)

  if (response.status === 401) {
    const refreshedAccessToken = await useAuthStore.getState().refreshSession()

    if (refreshedAccessToken) {
      response = await request(refreshedAccessToken)
    }
  }

  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
