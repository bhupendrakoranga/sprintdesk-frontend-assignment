import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LoginForm from '../LoginForm'
import { useAuthStore } from '../../../stores/authStore'
import type { LoginResponse } from '../../../types/global'

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

const LocationDisplay = () => {
  const location = useLocation()

  return <p data-testid="location">{location.pathname}</p>
}

const renderLoginForm = () => (
  render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginForm />
      <LocationDisplay />
    </MemoryRouter>,
  )
)

describe('LoginForm', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
    useAuthStore.setState({
      accessToken: null,
      user: null,
      status: 'unauthenticated',
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders the login form fields and submit action', () => {
    renderLoginForm()

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(screen.getByText('SprintDesk')).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toHaveAttribute('autocomplete', 'username')
    expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'current-password')
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('toggles password visibility from the icon button', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    const passwordInput = screen.getByLabelText('Password')
    const toggleButton = screen.getByRole('button', { name: 'Show password' })

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Hide password' }))

    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows validation errors and does not submit invalid credentials', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderLoginForm()

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Username is required')).toBeInTheDocument()
    expect(await screen.findByText('Password is required')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('submits valid credentials, stores the session, and navigates to dashboard', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(session),
    })
    vi.stubGlobal('fetch', fetchMock)
    renderLoginForm()

    await user.type(screen.getByLabelText('Username'), 'emilys')
    await user.type(screen.getByLabelText('Password'), 'emilyspass')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/dashboard')
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'emilys', password: 'emilyspass' }),
      }),
    )
    expect(localStorage.getItem('sprintdesk.refreshToken')).toBe('refresh-token')
    expect(useAuthStore.getState().accessToken).toBe('access-token')
    expect(useAuthStore.getState().user?.username).toBe('emilys')
    expect(useAuthStore.getState().status).toBe('authenticated')
  })

  it('shows an authentication error and clears it when the user edits a field', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Invalid credentials' }),
    }))
    renderLoginForm()

    await user.type(screen.getByLabelText('Username'), 'emilys')
    await user.type(screen.getByLabelText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')

    await user.type(screen.getByLabelText('Username'), '1')

    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
  })
})
