import { useState } from 'react'
import Button from '../../../components/ui/Button'
import InputField from '../../../components/ui/InputField'
import Modal from '../../../components/ui/Modal'
import Select from '../../../components/ui/Select'
import type { BoardUser, Task, TaskPriority, TaskStatus } from '../types'

interface TaskFormModalProps {
  isOpen: boolean
  users: BoardUser[]
  onClose: () => void
  onSubmit: (task: Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt' | 'completedAt'>) => void
}

const defaultStatus: TaskStatus = 'backlog'

export function TaskFormModal({ isOpen, users, onClose, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [assigneeId, setAssigneeId] = useState(users[0] ? String(users[0].id) : '')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !assigneeId || !dueDate) return
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status: defaultStatus,
      priority,
      assigneeId: Number(assigneeId),
      dueDate,
      sprintId: 3,
    })
  }

  return (
    <Modal isOpen={isOpen} title="Create task" onClose={onClose} footer={null}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField id="new-task-title" label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <div>
          <label htmlFor="new-task-description" className="block text-sm font-medium text-slate-900 dark:text-slate-100">Description</label>
          <textarea id="new-task-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select id="new-task-priority" label="Priority" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)} options={[{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }]} />
          <Select id="new-task-assignee" label="Assignee" value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)} options={users.map((user) => ({ label: user.name, value: user.id }))} />
        </div>
        <InputField id="new-task-due-date" label="Due date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required />
        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!title.trim() || !assigneeId || !dueDate}>Create task</Button>
        </div>
      </form>
    </Modal>
  )
}
