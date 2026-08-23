import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../authStore'
import type { LoginResponse } from '../../types/global'

const session: LoginResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://dummyjson.com/icon/emilys/128',
}

describe('auth store', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
    useAuthStore.setState({
      accessToken: null,
      user: null,
      status: 'unauthenticated',
    })
  })

  it('stores the access token in memory and the refresh token in localStorage', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(session),
    })
    vi.stubGlobal('fetch', fetchMock)

    await useAuthStore.getState().login({ username: 'emilys', password: 'emilyspass' })

    expect(useAuthStore.getState().accessToken).toBe('access-token')
    expect(useAuthStore.getState().user?.username).toBe('emilys')
    expect(useAuthStore.getState().status).toBe('authenticated')
    expect(localStorage.getItem('sprintdesk.refreshToken')).toBe('refresh-token')
  })

  it('clears the session and refresh token on logout', () => {
    localStorage.setItem('sprintdesk.refreshToken', 'refresh-token')
    useAuthStore.setState({
      accessToken: 'access-token',
      user: {
        id: session.id,
        username: session.username,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        gender: session.gender,
        image: session.image,
      },
      status: 'authenticated',
    })

    useAuthStore.getState().logout()

    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().status).toBe('unauthenticated')
    expect(localStorage.getItem('sprintdesk.refreshToken')).toBeNull()
  })
})
