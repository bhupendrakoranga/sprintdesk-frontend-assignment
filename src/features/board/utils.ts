import type { Task, TaskStatus } from './types'

const taskStatuses: TaskStatus[] = ['backlog', 'in-progress', 'review', 'done']

export function getTaskStatusFromDropTarget(
  tasks: Task[],
  overId: string | number | undefined,
): TaskStatus | null {
  if (typeof overId === 'string' && taskStatuses.includes(overId as TaskStatus)) {
    return overId as TaskStatus
  }

  const taskId = typeof overId === 'number' ? overId : Number(overId)
  return tasks.find((task) => task.id === taskId)?.status ?? null
}

export function formatTaskDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}
