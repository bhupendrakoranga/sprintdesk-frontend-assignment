import { lazy } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthenticatedRoute, GuestOnlyRoute } from './AuthRouteGuards'

const Login = lazy(() => import('../pages/login/Login'))
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Board = lazy(() => import('../pages/board/Board'))
const Analytics = lazy(() => import('../pages/analytics/Analytics'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <GuestOnlyRoute />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  {
    element: <AuthenticatedRoute />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'board',
        element: <Board />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
const Router = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Router
