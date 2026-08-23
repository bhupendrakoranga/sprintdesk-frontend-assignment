import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import NeedsAttentionCard from '../NeedsAttentionCard'
import RecentUpdatesCard from '../RecentUpdatesCard'
import SprintProgressCard from '../SprintProgressCard'
import TeamWorkloadCard from '../TeamWorkloadCard'
import TodaysFocusCard from '../TodaysFocusCard'
import type {
  AttentionTaskItem,
  RecentTaskItem,
  StatusSummary,
  WorkloadMemberItem,
} from '../../types'

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

const statuses: StatusSummary[] = [
  {
    id: 'backlog',
    label: 'Backlog',
    segmentClassName: 'bg-slate-400',
    dotClassName: 'bg-slate-400',
    count: 2,
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    segmentClassName: 'bg-amber-500',
    dotClassName: 'bg-amber-500',
    count: 3,
  },
  {
    id: 'review',
    label: 'Review',
    segmentClassName: 'bg-violet-500',
    dotClassName: 'bg-violet-500',
    count: 1,
  },
  {
    id: 'done',
    label: 'Done',
    segmentClassName: 'bg-emerald-500',
    dotClassName: 'bg-emerald-500',
    count: 4,
  },
]

const attentionItems: AttentionTaskItem[] = [
  {
    id: 12,
    title: 'Accessibility audit',
    priority: 'high',
    priorityClassName: 'bg-rose-50 text-rose-700',
    assigneeName: 'David Miller',
    statusLabel: 'review',
    dueLabel: 'Due today',
    dueClassName: 'text-amber-700',
    dueDateLabel: 'Aug 23',
  },
]

const recentItems: RecentTaskItem[] = [
  {
    id: 18,
    title: 'Handle API errors',
    priority: 'medium',
    priorityClassName: 'bg-amber-50 text-amber-700',
    assigneeName: 'Sarah Brown',
    updatedLabel: 'Aug 23',
    dueLabel: 'Due tomorrow',
    dueClassName: 'text-amber-700',
  },
]

const workloadMembers: WorkloadMemberItem[] = [
  {
    id: 1,
    name: 'Michael Williams',
    initials: 'MW',
    active: 4,
    highPriority: 1,
    completed: 2,
  },
  {
    id: 2,
    name: 'Emily Johnson',
    initials: 'EJ',
    active: 1,
    highPriority: 0,
    completed: 4,
  },
]

describe('dashboard section components', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders sprint progress totals, status counts, and segment widths', () => {
    render(
      <SprintProgressCard
        active={6}
        completed={4}
        completion={40}
        statuses={statuses}
        total={10}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Sprint progress' })).toBeInTheDocument()
    expect(screen.getByText('4 completed, 6 still active')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('30% of total')).toBeInTheDocument()

    const distributionBar = screen.getByLabelText('Sprint progress: 40 percent complete')
    const [backlogSegment, inProgressSegment, reviewSegment, doneSegment] = Array.from(
      distributionBar.children,
    ) as HTMLElement[]

    expect(backlogSegment.style.width).toBe('20%')
    expect(inProgressSegment.style.width).toBe('30%')
    expect(reviewSegment.style.width).toBe('10%')
    expect(doneSegment.style.width).toBe('40%')
  })

  it('renders focus counts with accessible progress bars', () => {
    render(
      <TodaysFocusCard
        active={10}
        dueSoon={2}
        highPriorityActive={3}
        overdue={1}
        review={4}
      />,
    )

    expect(screen.getByRole('heading', { name: "Today's focus" })).toBeInTheDocument()
    expect(screen.getByText('3 high')).toBeInTheDocument()

    const overdueBar = screen.getByRole('progressbar', { name: 'Overdue' })
    const dueSoonBar = screen.getByRole('progressbar', { name: 'Due soon' })
    const reviewBar = screen.getByRole('progressbar', { name: 'Review queue' })

    expect(overdueBar).toHaveAttribute('aria-valuenow', '1')
    expect(dueSoonBar).toHaveAttribute('aria-valuenow', '2')
    expect(reviewBar).toHaveAttribute('aria-valuenow', '4')
    expect((overdueBar.firstElementChild as HTMLElement).style.width).toBe('10%')
    expect((dueSoonBar.firstElementChild as HTMLElement).style.width).toBe('20%')
    expect((reviewBar.firstElementChild as HTMLElement).style.width).toBe('40%')
  })

  it('renders attention items as board links and supports an empty state', () => {
    const { rerender } = renderWithRouter(<NeedsAttentionCard items={attentionItems} />)

    expect(screen.getByRole('heading', { name: 'Needs attention' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /accessibility audit/i })).toHaveAttribute('href', '/board')
    expect(screen.getByText('David Miller - review')).toBeInTheDocument()
    expect(screen.getByText('Due today')).toBeInTheDocument()
    expect(screen.getByText('Aug 23')).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <NeedsAttentionCard items={[]} />
      </MemoryRouter>,
    )

    expect(screen.getByText('No urgent work right now.')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders recent task updates from props', () => {
    render(<RecentUpdatesCard items={recentItems} />)

    expect(screen.getByRole('heading', { name: 'Recent updates' })).toBeInTheDocument()
    expect(screen.getByText('Handle API errors')).toBeInTheDocument()
    expect(screen.getByText('Sarah Brown - updated Aug 23')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('Due tomorrow')).toBeInTheDocument()
  })

  it('renders team workload rows with aligned status text and progress values', () => {
    render(
      <TeamWorkloadCard
        maxActiveAssignments={4}
        members={workloadMembers}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Team workload' })).toBeInTheDocument()
    expect(screen.getByText('MW')).toBeInTheDocument()
    expect(screen.getByText('Michael Williams')).toBeInTheDocument()
    expect(screen.getByText('2 completed')).toBeInTheDocument()
    expect(screen.getByText('1 high')).toBeInTheDocument()
    expect(screen.queryByText('0 high')).not.toBeInTheDocument()

    const michaelBar = screen.getByRole('progressbar', { name: 'Michael Williams active workload' })
    const emilyBar = screen.getByRole('progressbar', { name: 'Emily Johnson active workload' })

    expect(michaelBar).toHaveAttribute('aria-valuenow', '4')
    expect(emilyBar).toHaveAttribute('aria-valuenow', '1')
    expect((michaelBar.firstElementChild as HTMLElement).style.width).toBe('100%')
    expect((emilyBar.firstElementChild as HTMLElement).style.width).toBe('25%')
    expect(screen.getByText('1 active')).toHaveClass('whitespace-nowrap')
  })
})
