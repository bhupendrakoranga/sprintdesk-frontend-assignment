import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { BoardUser, Task, TaskPriority, TaskStatus } from '../types'
import { TaskCard } from './TaskCard'

interface BoardColumnProps {
  column: { id: TaskStatus; label: string; color: string }
  tasks: Task[]
  users: BoardUser[]
  priorityClasses: Record<TaskPriority, string>
  onOpenTask?: (task: Task) => void
}

export function BoardColumn({ column, tasks, users, priorityClasses, onOpenTask }: BoardColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id })

  return (
    <article
      ref={setNodeRef}
      className={`flex h-full min-h-0 flex-col rounded-xl border p-3 transition-colors ${
        isOver
          ? 'border-indigo-300 bg-indigo-50/70 dark:border-indigo-700 dark:bg-indigo-950/30'
          : 'border-slate-200 bg-slate-100/70 dark:border-slate-700 dark:bg-slate-900/80'
      }`}
      aria-label={`${column.label} column`}
    >
      <div className="flex items-center justify-between px-1 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${column.color}`} aria-hidden="true" />
          <h2 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{column.label}</h2>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-gutter:stable] [scrollbar-width:thin]">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} users={users} priorityClasses={priorityClasses} onOpen={onOpenTask} />
          ))}
          {tasks.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-300 px-3 py-8 text-center text-xs text-slate-400">
              Drop tasks here
            </p>
          )}
        </div>
      </SortableContext>
    </article>
  )
}
