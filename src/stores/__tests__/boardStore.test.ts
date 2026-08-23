import { beforeEach, describe, expect, it } from 'vitest'
import mockData from '../../data/mock-data.json'
import type { MockData } from '../../features/board/types'
import { useBoardStore } from '../boardStore'

describe('board store', () => {
  beforeEach(() => {
    localStorage.clear()
    useBoardStore.setState({
      users: [],
      tasks: [],
      comments: [],
      isHydrated: false,
      sourceUsers: [],
      sourceTasks: [],
      sourceComments: [],
    })
    useBoardStore.getState().hydrateBoard(mockData as MockData)
  })

  it('loads the 30 initial sprint tasks', () => {
    expect(useBoardStore.getState().tasks).toHaveLength(30)
  })

  it('moves a task to another column and can reset the board', () => {
    useBoardStore.getState().moveTask(1, 'backlog')

    expect(useBoardStore.getState().tasks.find((task) => task.id === 1)?.status).toBe('backlog')

    useBoardStore.getState().resetBoard()

    expect(useBoardStore.getState().tasks.find((task) => task.id === 1)?.status).toBe('done')
  })

  it('adds, updates, comments, and deletes a task', () => {
    const initialCount = useBoardStore.getState().tasks.length
    const task = useBoardStore.getState().addTask({
      title: 'Test task',
      description: 'A task created during the store test.',
      status: 'backlog',
      priority: 'low',
      assigneeId: 1,
      dueDate: '2026-08-30',
      sprintId: 3,
    })

    expect(useBoardStore.getState().tasks).toHaveLength(initialCount + 1)

    useBoardStore.getState().updateTask(task.id, { title: 'Updated test task' })
    useBoardStore.getState().addComment({ taskId: task.id, authorId: 1, message: 'Test comment' })
    expect(useBoardStore.getState().tasks.find((item) => item.id === task.id)?.title).toBe('Updated test task')
    expect(useBoardStore.getState().comments.some((item) => item.taskId === task.id)).toBe(true)

    useBoardStore.getState().deleteTask(task.id)
    expect(useBoardStore.getState().tasks).toHaveLength(initialCount)
    expect(useBoardStore.getState().comments.some((item) => item.taskId === task.id)).toBe(false)
  })
})
