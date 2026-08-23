import { useEffect, useMemo, useState } from 'react'
import Button from '../../../components/ui/Button'
import InputField from '../../../components/ui/InputField'
import Select from '../../../components/ui/Select'
import type { BoardComment, BoardUser, Task, TaskPriority } from '../types'
import { formatTaskDate } from '../utils'

interface TaskDrawerProps {
  task: Task | null
  users: BoardUser[]
  comments: BoardComment[]
  onClose: () => void
  onSave: (taskId: number, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'assigneeId' | 'dueDate'>>) => void
  onAddComment: (taskId: number, message: string) => void
  onDelete: (task: Task) => void
}

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

export function TaskDrawer({ task, users, comments, onClose, onSave, onAddComment, onDelete }: TaskDrawerProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [assigneeId, setAssigneeId] = useState(task ? String(task.assigneeId) : '')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [comment, setComment] = useState('')

  const taskComments = useMemo(
    () => comments.filter((item) => item.taskId === task?.id),
    [comments, task?.id],
  )

  useEffect(() => {
    if (!task) return undefined

    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [task])

  if (!task) return null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return

    onSave(task.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      assigneeId: Number(assigneeId),
      dueDate,
    })
    onClose()
  }

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!comment.trim()) return
    onAddComment(task.id, comment.trim())
    setComment('')
  }

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-slate-950/20" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose()
    }}>
      <aside
        className="absolute bottom-3 left-3 right-3 top-3 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:bottom-4 sm:left-auto sm:right-4 sm:top-4 sm:w-[min(calc(100%-2rem),52rem)] sm:max-h-[calc(100dvh-2rem)] xl:w-[min(calc(100%-2rem),58rem)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
      >
        <div className="shrink-0 border-b border-slate-200 px-5 py-3 dark:border-slate-700 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">Task details</p>
              <h2 id="task-drawer-title" className="mt-1 break-words text-lg font-semibold text-slate-900 dark:text-white">{task.title}</h2>
            </div>
            <button type="button" onClick={onClose} className="shrink-0 rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:hover:bg-slate-800" aria-label="Close task details">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 [scrollbar-gutter:stable] [scrollbar-width:thin] sm:px-6">
          <form id="task-edit-form" className="space-y-4" onSubmit={handleSubmit}>
            <section className="space-y-4" aria-labelledby="task-key-details-title">
              <InputField id="task-title" label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
              <div>
                <label htmlFor="task-description" className="block text-sm font-medium text-slate-900 dark:text-slate-100">Description</label>
                <textarea id="task-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="mt-2 block w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select id="task-priority" label="Priority" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)} options={priorityOptions} />
                <Select id="task-assignee" label="Assignee" value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)} options={users.map((user) => ({ label: user.name, value: user.id }))} />
              </div>
              <InputField id="task-due-date" label="Due date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required />
            </section>
          </form>

          <section className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700" aria-labelledby="comments-title">
            <div className="flex items-center justify-between gap-3">
              <h3 id="comments-title" className="text-sm font-semibold text-slate-900 dark:text-slate-100">Comments</h3>
              <span className="text-xs text-slate-400">{taskComments.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {taskComments.length > 0 ? taskComments.map((item) => {
                const author = users.find((user) => user.id === item.authorId)?.name ?? 'Team member'
                return (
                  <article key={item.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="min-w-0 break-words text-xs font-semibold text-slate-700 dark:text-slate-200">{author}</p>
                      <time className="shrink-0 text-[11px] text-slate-400" dateTime={item.createdAt}>{formatTaskDate(item.createdAt.slice(0, 10))}</time>
                    </div>
                    <p className="mt-2 break-words text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
                  </article>
                )
              }) : <p className="text-sm text-slate-500">No comments yet.</p>}
            </div>
            <form className="mt-4 space-y-3" onSubmit={handleCommentSubmit}>
              <label htmlFor="new-comment" className="block text-sm font-medium text-slate-900 dark:text-slate-100">Add a comment</label>
              <textarea id="new-comment" value={comment} onChange={(event) => setComment(event.target.value)} rows={2} placeholder="Write an update..." className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <div className="flex justify-end"><Button type="submit" variant="outline" disabled={!comment.trim()}>Add comment</Button></div>
            </form>
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="danger" onClick={() => onDelete(task)}>Delete task</Button>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" form="task-edit-form">Save changes</Button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
