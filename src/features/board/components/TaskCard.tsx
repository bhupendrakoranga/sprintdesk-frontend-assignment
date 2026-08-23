import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BoardUser, Task, TaskPriority } from '../types'
import { formatTaskDate } from '../utils'

interface TaskCardProps {
  task: Task
  users: BoardUser[]
  priorityClasses: Record<TaskPriority, string>
  onOpen?: (task: Task) => void
}

interface TaskCardContentProps extends TaskCardProps {
  isOverlay?: boolean
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function TaskCardContent({ task, users, priorityClasses, onOpen, isOverlay = false }: TaskCardContentProps) {
  const assignee = users.find((user) => user.id === task.assigneeId)
  const assigneeName = assignee?.name ?? 'Unassigned'

  return (
    <article
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900 ${
        isOverlay ? 'shadow-xl ring-2 ring-indigo-200' : ''
      }`}
      onClick={() => onOpen?.(task)}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 break-words text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">{task.title}</h3>
        <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${priorityClasses[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">{task.description}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span className="flex min-w-0 items-center gap-2 truncate" title={assigneeName}>
          {assignee?.avatar ? (
            <img src={assignee.avatar} alt={`${assigneeName} avatar`} className="h-5 w-5 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-700">
              {getInitials(assigneeName)}
            </span>
          )}
          <span className="truncate">{assigneeName}</span>
        </span>
        <time className="shrink-0 whitespace-nowrap" dateTime={task.dueDate}>{formatTaskDate(task.dueDate)}</time>
      </div>
    </article>
  )
}

export const TaskCard = memo(function TaskCard({ task, users, priorityClasses, onOpen }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab touch-none focus-visible:outline-2 focus-visible:outline-indigo-600 active:cursor-grabbing ${
        isDragging ? 'opacity-40' : ''
      }`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && onOpen) {
          event.preventDefault()
          onOpen(task)
        }
      }}
      tabIndex={0}
      aria-label={`Task: ${task.title}. Press space to drag.`}
    >
      <TaskCardContent task={task} users={users} priorityClasses={priorityClasses} onOpen={onOpen} />
    </div>
  )
})

export function TaskCardPreview({ task, users, priorityClasses }: Omit<TaskCardProps, 'onOpen'>) {
  return <TaskCardContent task={task} users={users} priorityClasses={priorityClasses} isOverlay />
}
