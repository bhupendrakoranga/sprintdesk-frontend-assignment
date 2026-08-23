import type { ReactNode } from 'react'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface LoginResponse extends AuthUser {
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface ApiErrorResponse {
  message?: string;
}

export interface MainLayoutProps {
  children: ReactNode
}

export interface SkeletonProps {
  className?: string
  lines?: number
}