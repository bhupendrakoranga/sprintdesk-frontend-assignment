import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch } from '../apiClient'
import { useAuthStore } from '../../stores/authStore'

const response = (body: unknown, status: number) => ({
  ok: status >= 200 && status < 300,
  status,
  json: vi.fn().mockResolvedValue(body),
  clone: vi.fn().mockReturnValue({
    json: vi.fn().mockResolvedValue(body),
  }),
})

describe('api client authentication interceptor', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
    useAuthStore.setState({
      accessToken: 'expired-access-token',
      user: null,
      status: 'authenticated',
    })
    localStorage.setItem('sprintdesk.refreshToken', 'old-refresh-token')
  })

  it('refreshes an expired token and retries the failed request with the new bearer token', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response({ message: 'Token expired' }, 401))
      .mockResolvedValueOnce(response({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }, 200))
      .mockResolvedValueOnce(response({ tasks: [] }, 200))
    vi.stubGlobal('fetch', fetchMock)

    const result = await apiFetch<{ tasks: unknown[] }>('/tasks')

    expect(result).toEqual({ tasks: [] })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    const firstRequest = fetchMock.mock.calls[0][1] as RequestInit
    const retriedRequest = fetchMock.mock.calls[2][1] as RequestInit

    expect((firstRequest.headers as Headers).get('Authorization')).toBe('Bearer expired-access-token')
    expect((retriedRequest.headers as Headers).get('Authorization')).toBe('Bearer new-access-token')
    expect(localStorage.getItem('sprintdesk.refreshToken')).toBe('new-refresh-token')
    expect(useAuthStore.getState().accessToken).toBe('new-access-token')
  })
})
