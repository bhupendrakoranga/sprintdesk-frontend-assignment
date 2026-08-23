import type { ComponentType, SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement>
export type IconComponent = ComponentType<IconProps>

const baseIconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="2" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="2" {...props}>
      <path d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="1.8" {...props}>
      <path d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    </svg>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="1.8" {...props}>
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z" />
    </svg>
  )
}

export function BellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="1.8" {...props}>
      <path d="M15 17H9m10-2V11a7 7 0 1 0-14 0v4l-2 2h18l-2-2Zm-7 5h2" />
    </svg>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="1.8" {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
  )
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="1.8" {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
      <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5 0 8.5 4.2 10 8a14.6 14.6 0 0 1-3.1 4.5" />
      <path d="M6.6 6.6A14.8 14.8 0 0 0 2 12c1.5 3.8 5 8 10 8 1.4 0 2.7-.3 3.9-.9" />
    </svg>
  )
}

export function DashboardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="1.8" {...props}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5v-4ZM13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 13 9.5v-4ZM4 14.5A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 9.5 20h-4A1.5 1.5 0 0 1 4 18.5v-4ZM13 14.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4Z" />
    </svg>
  )
}

export function BoardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="1.8" {...props}>
      <path d="M5 5.5h14M5 12h14M5 18.5h14" />
      <path d="M7 4v15.5M12 4v15.5M17 4v15.5" />
    </svg>
  )
}

export function AnalyticsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...baseIconProps} strokeWidth="1.8" {...props}>
      <path d="M4.5 19.5h15" />
      <path d="M7 16v-4M12 16V7M17 16v-6" />
      <path d="M6 8.5 10 5l4 3 4-4" />
    </svg>
  )
}
