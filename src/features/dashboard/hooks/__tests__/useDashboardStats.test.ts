import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { BoardUser, Task } from '../../../board/types'
import { useDashboardStats } from '../useDashboardStats'

const users: BoardUser[] = [
  {
    id: 1,
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    avatar: '',
  },
  {
    id: 2,
    name: 'Michael Williams',
    email: 'michael.williams@example.com',
    avatar: '',
  },
]

const tasks: Task[] = [
  {
    id: 1,
    title: 'Finished login',
    description: 'Completed auth flow',
    status: 'done',
    priority: 'high',
    assigneeId: 1,
    dueDate: '2026-08-21',
    sprintId: 3,
    order: 1,
    createdAt: '2026-08-20T09:00:00Z',
    completedAt: '2026-08-21T10:00:00Z',
    updatedAt: '2026-08-21T10:00:00Z',
  },
  {
    id: 2,
    title: 'Fix blocked deploy',
    description: 'Resolve deployment issue',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 2,
    dueDate: '2026-08-22',
    sprintId: 3,
    order: 1,
    createdAt: '2026-08-21T09:00:00Z',
    completedAt: null,
    updatedAt: '2026-08-23T10:00:00Z',
  },
  {
    id: 3,
    title: 'Review dashboard',
    description: 'Review the dashboard UI',
    status: 'review',
    priority: 'medium',
    assigneeId: 1,
    dueDate: '2026-08-23',
    sprintId: 3,
    order: 1,
    createdAt: '2026-08-22T09:00:00Z',
    completedAt: null,
    updatedAt: '2026-08-23T09:00:00Z',
  },
  {
    id: 4,
    title: 'Plan analytics',
    description: 'Scope chart work',
    status: 'backlog',
    priority: 'low',
    assigneeId: 2,
    dueDate: '2026-08-27',
    sprintId: 3,
    order: 1,
    createdAt: '2026-08-22T11:00:00Z',
    completedAt: null,
    updatedAt: '2026-08-22T11:00:00Z',
  },
]

describe('useDashboardStats', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('derives dashboard metrics, attention items, recent work, and workload', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 23, 12))

    const { result } = renderHook(() => useDashboardStats(tasks, users))

    expect(result.current.total).toBe(4)
    expect(result.current.active).toBe(3)
    expect(result.current.completed).toBe(1)
    expect(result.current.completion).toBe(25)
    expect(result.current.overdue).toBe(1)
    expect(result.current.dueSoon).toBe(1)
    expect(result.current.highPriorityActive).toBe(1)
    expect(result.current.byStatus).toEqual([
      expect.objectContaining({ id: 'backlog', count: 1 }),
      expect.objectContaining({ id: 'in-progress', count: 1 }),
      expect.objectContaining({ id: 'review', count: 1 }),
      expect.objectContaining({ id: 'done', count: 1 }),
    ])
    expect(result.current.metrics.map((metric) => [metric.label, metric.value])).toEqual([
      ['Active tasks', 3],
      ['Due now', 2],
      ['In review', 1],
      ['Completion', '25%'],
    ])
    expect(result.current.attentionTasks.map((task) => task.title)).toEqual([
      'Fix blocked deploy',
      'Review dashboard',
    ])
    expect(result.current.attentionTasks[0]).toEqual(expect.objectContaining({
      assigneeName: 'Michael Williams',
      dueLabel: '1d overdue',
      priority: 'high',
    }))
    expect(result.current.recentTasks.map((task) => task.title)).toEqual([
      'Fix blocked deploy',
      'Review dashboard',
      'Plan analytics',
      'Finished login',
    ])
    expect(result.current.workload).toEqual([
      expect.objectContaining({
        name: 'Michael Williams',
        initials: 'MW',
        active: 2,
        completed: 0,
      }),
      expect.objectContaining({
        name: 'Emily Johnson',
        initials: 'EJ',
        active: 1,
        completed: 1,
      }),
    ])
    expect(result.current.maxActiveAssignments).toBe(2)
  })
})
