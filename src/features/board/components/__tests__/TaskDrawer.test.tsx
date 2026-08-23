import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TaskDrawer } from '../TaskDrawer'
import type { BoardUser, Task } from '../../types'

const users: BoardUser[] = [
  {
    id: 1,
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    avatar: '',
  },
  {
    id: 2,
    name: 'David Miller',
    email: 'david.miller@example.com',
    avatar: '',
  },
]

const task: Task = {
  id: 10,
  title: 'Original task',
  description: 'Original description',
  status: 'backlog',
  priority: 'medium',
  assigneeId: 1,
  dueDate: '2026-08-24',
  sprintId: 3,
  order: 1,
  createdAt: '2026-08-20T10:00:00Z',
  completedAt: null,
  updatedAt: '2026-08-20T10:00:00Z',
}

describe('TaskDrawer', () => {
  afterEach(() => {
    cleanup()
  })

  it('saves task updates and closes the drawer', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onClose = vi.fn()

    render(
      <TaskDrawer
        task={task}
        users={users}
        comments={[]}
        onClose={onClose}
        onSave={onSave}
        onAddComment={() => undefined}
        onDelete={() => undefined}
      />,
    )

    await user.clear(screen.getByLabelText('Title'))
    await user.type(screen.getByLabelText('Title'), 'Updated task')
    await user.selectOptions(screen.getByLabelText('Priority'), 'high')
    await user.selectOptions(screen.getByLabelText('Assignee'), '2')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(onSave).toHaveBeenCalledWith(10, {
      title: 'Updated task',
      description: 'Original description',
      priority: 'high',
      assigneeId: 2,
      dueDate: '2026-08-24',
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('adds a trimmed comment', async () => {
    const user = userEvent.setup()
    const onAddComment = vi.fn()

    render(
      <TaskDrawer
        task={task}
        users={users}
        comments={[]}
        onClose={() => undefined}
        onSave={() => undefined}
        onAddComment={onAddComment}
        onDelete={() => undefined}
      />,
    )

    await user.type(screen.getByLabelText('Add a comment'), '  Looks ready  ')
    await user.click(screen.getByRole('button', { name: 'Add comment' }))

    expect(onAddComment).toHaveBeenCalledWith(10, 'Looks ready')
  })
})
