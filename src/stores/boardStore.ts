import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoardComment, BoardUser, MockData, Task, TaskStatus } from '../features/board/types'

const taskStatuses: TaskStatus[] = ['backlog', 'in-progress', 'review', 'done']

type TaskUpdates = Partial<Pick<Task, 'title' | 'description' | 'priority' | 'assigneeId' | 'dueDate'>>

interface BoardState {
  users: BoardUser[]
  tasks: Task[]
  comments: BoardComment[]
  isHydrated: boolean
  sourceUsers: BoardUser[]
  sourceTasks: Task[]
  sourceComments: BoardComment[]
  hydrateBoard: (data: MockData) => void
  moveTask: (taskId: number, status: TaskStatus, overTaskId?: number) => void
  addTask: (task: Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt' | 'completedAt'>) => Task
  updateTask: (taskId: number, updates: TaskUpdates) => void
  deleteTask: (taskId: number) => void
  addComment: (comment: Omit<BoardComment, 'id' | 'createdAt'>) => void
  resetBoard: () => void
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      users: [],
      tasks: [],
      comments: [],
      isHydrated: false,
      sourceUsers: [],
      sourceTasks: [],
      sourceComments: [],
      hydrateBoard: (data) =>
        set((state) => ({
          users: data.users,
          tasks: state.isHydrated ? state.tasks : data.tasks,
          comments: state.isHydrated ? state.comments : data.comments,
          isHydrated: true,
          sourceUsers: data.users,
          sourceTasks: data.tasks,
          sourceComments: data.comments,
        })),
      moveTask: (taskId, status, overTaskId) =>
        set((state) => {
          const task = state.tasks.find((item) => item.id === taskId)
          if (!task || overTaskId === taskId) return state

          const withoutTask = state.tasks.filter((item) => item.id !== taskId)
          const targetTasks = withoutTask.filter((item) => item.status === status)
          const overIndex = overTaskId === undefined
            ? -1
            : targetTasks.findIndex((item) => item.id === overTaskId)
          const insertAt = overIndex === -1 ? targetTasks.length : overIndex
          const movedTask: Task = {
            ...task,
            status,
            completedAt: status === 'done' ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString(),
          }

          targetTasks.splice(insertAt === -1 ? targetTasks.length : insertAt, 0, movedTask)

          const nextTasks = taskStatuses.flatMap((columnStatus) => {
            const columnTasks = columnStatus === status
              ? targetTasks
              : withoutTask.filter((item) => item.status === columnStatus)

            return columnTasks.map((item, index) => ({ ...item, order: index + 1 }))
          })

          return { tasks: nextTasks }
        }),
      addTask: (taskInput) => {
        const now = new Date().toISOString()
        const newTask: Task = {
          ...taskInput,
          id: Date.now(),
          order: 1,
          createdAt: now,
          updatedAt: now,
          completedAt: null,
        }

        set((state) => {
          const columnTasks = state.tasks.filter((task) => task.status === newTask.status)
          const nextTasks = [...state.tasks, { ...newTask, order: columnTasks.length + 1 }]
          return { tasks: nextTasks }
        })

        return newTask
      },
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task,
          ),
        })),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: taskStatuses.flatMap((status) => state.tasks
            .filter((task) => task.id !== taskId && task.status === status)
            .map((task, index) => ({ ...task, order: index + 1 }))),
          comments: state.comments.filter((comment) => comment.taskId !== taskId),
        })),
      addComment: (commentInput) =>
        set((state) => ({
          comments: [
            ...state.comments,
            {
              ...commentInput,
              id: Date.now(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      resetBoard: () =>
        set((state) => ({
          users: state.sourceUsers,
          tasks: state.sourceTasks,
          comments: state.sourceComments,
          isHydrated: state.sourceTasks.length > 0,
        })),
    }),
    {
      name: 'sprintdesk.board.v2',
      partialize: (state) => ({
        users: state.users,
        tasks: state.tasks,
        comments: state.comments,
        isHydrated: state.isHydrated,
      }),
    },
  ),
)
