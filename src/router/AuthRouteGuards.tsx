import { Suspense, type ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Loader from '../components/ui/Loader'
import { useAuthStore } from '../stores/authStore'

type AuthGateMode = 'authenticated' | 'guest'

interface AuthGateProps {
  fallback: ReactNode
  mode: AuthGateMode
}

const LOGIN_PATH = '/login'
const AUTHENTICATED_HOME_PATH = '/dashboard'

export function RouteLoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
      <Loader color="#4f46e5" height={10} width={4} radius={2} margin={2} />
      <p className="text-sm font-medium">Checking your session...</p>
    </div>
  )
}

export function PageLoadingScreen() {
  return (
    <MainLayout>
      <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center text-indigo-600 dark:text-indigo-300">
        <Loader color="currentColor" height={10} width={4} radius={2} margin={2} aria-label="Loading page" />
      </div>
    </MainLayout>
  )
}

function AuthGate({ fallback, mode }: AuthGateProps) {
  const status = useAuthStore((state) => state.status)

  if (status === 'loading') {
    return <RouteLoadingScreen />
  }

  const isAuthenticated = status === 'authenticated'

  if (mode === 'authenticated' && !isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace />
  }

  if (mode === 'guest' && isAuthenticated) {
    return <Navigate to={AUTHENTICATED_HOME_PATH} replace />
  }

  return (
    <Suspense fallback={fallback}>
      <Outlet />
    </Suspense>
  )
}

export function AuthenticatedRoute() {
  return <AuthGate fallback={<PageLoadingScreen />} mode="authenticated" />
}

export function GuestOnlyRoute() {
  return <AuthGate fallback={<RouteLoadingScreen />} mode="guest" />
}
