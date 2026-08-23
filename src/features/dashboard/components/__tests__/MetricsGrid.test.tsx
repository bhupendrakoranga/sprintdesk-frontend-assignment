import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { IconProps } from '../../../../utils/icons'
import MetricsGrid from '../MetricsGrid'
import type { DashboardMetric } from '../../types'

const TestIcon = (props: IconProps) => (
  <svg data-testid="metric-icon" viewBox="0 0 24 24" {...props}>
    <path d="M4 12h16" />
  </svg>
)

const metrics: DashboardMetric[] = [
  {
    label: 'Active tasks',
    value: 8,
    detail: '3 in progress',
    badge: 'Open work',
    icon: TestIcon,
    iconClassName: 'bg-sky-50 text-sky-700',
  },
  {
    label: 'Completion',
    value: '64%',
    detail: '18 of 28 tasks done',
    badge: '6 members',
    icon: TestIcon,
    iconClassName: 'bg-emerald-50 text-emerald-700',
  },
]

describe('MetricsGrid', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders an accessible metrics section', () => {
    render(<MetricsGrid metrics={metrics} />)

    expect(screen.getByLabelText('Sprint metrics')).toBeInTheDocument()
  })

  it('renders each metric card with label, value, detail, and badge', () => {
    render(<MetricsGrid metrics={metrics} />)

    const region = screen.getByLabelText('Sprint metrics')
    const cards = within(region).getAllByRole('article')

    expect(cards).toHaveLength(2)
    expect(within(cards[0]).getByText('Active tasks')).toBeInTheDocument()
    expect(within(cards[0]).getByText('8')).toBeInTheDocument()
    expect(within(cards[0]).getByText('3 in progress')).toBeInTheDocument()
    expect(within(cards[0]).getByText('Open work')).toBeInTheDocument()
    expect(within(cards[1]).getByText('Completion')).toBeInTheDocument()
    expect(within(cards[1]).getByText('64%')).toBeInTheDocument()
    expect(within(cards[1]).getByText('18 of 28 tasks done')).toBeInTheDocument()
    expect(within(cards[1]).getByText('6 members')).toBeInTheDocument()
  })

  it('renders metric icons as decorative elements with the provided color classes', () => {
    render(<MetricsGrid metrics={metrics} />)

    const icons = screen.getAllByTestId('metric-icon')

    expect(icons).toHaveLength(2)
    expect(icons[0]).toHaveAttribute('aria-hidden', 'true')
    expect(icons[0]).toHaveClass('h-5')
    expect(screen.getByText('Active tasks').closest('article')?.querySelector('.bg-sky-50')).toBeInTheDocument()
    expect(screen.getByText('Completion').closest('article')?.querySelector('.bg-emerald-50')).toBeInTheDocument()
  })

  it('renders an empty metrics region without cards', () => {
    render(<MetricsGrid metrics={[]} />)

    const region = screen.getByLabelText('Sprint metrics')

    expect(region).toBeInTheDocument()
    expect(within(region).queryAllByRole('article')).toHaveLength(0)
  })
})
