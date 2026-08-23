import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import type { ReactElement } from 'react'
import DashboardHeader from '../DashboardHeader'

const defaultProps = {
  eyebrow: 'Sprint command center',
  title: 'Dashboard',
  description: 'Track sprint health, urgent work, and team load from one focused view.',
}

const renderWithRouter = (ui: ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('DashboardHeader', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders all header copy from props', () => {
    renderWithRouter(<DashboardHeader {...defaultProps} />)

    expect(screen.getByText(defaultProps.eyebrow)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: defaultProps.title })).toBeInTheDocument()
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument()
  })

  it('renders the board and analytics actions with correct routes', () => {
    renderWithRouter(<DashboardHeader {...defaultProps} />)

    const boardLink = screen.getByRole('link', { name: /open board/i })
    const analyticsLink = screen.getByRole('link', { name: /analytics/i })

    expect(boardLink).toHaveAttribute('href', '/board')
    expect(analyticsLink).toHaveAttribute('href', '/analytics')
  })

  it('keeps action labels stable when the header copy changes', () => {
    const { rerender } = renderWithRouter(<DashboardHeader {...defaultProps} />)

    rerender(
      <MemoryRouter>
        <DashboardHeader
          eyebrow="Release view"
          title="Team dashboard"
          description="Watch the release queue and delivery health."
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Release view')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Team dashboard' })).toBeInTheDocument()
    expect(screen.queryByText(defaultProps.description)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open board/i })).toHaveAttribute('href', '/board')
    expect(screen.getByRole('link', { name: /analytics/i })).toHaveAttribute('href', '/analytics')
  })
})
