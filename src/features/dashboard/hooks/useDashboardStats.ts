import { useMemo } from 'react'
import { AnalyticsIcon, BellIcon, BoardIcon, DashboardIcon } from '../../../utils/icons'
import type { BoardUser, Task, TaskPriority, TaskStatus } from '../../board/types'
import type {
  AttentionTaskItem,
  DashboardMetric,
  RecentTaskItem,
  StatusSummary,
  WorkloadMemberItem,
} from '../types'

const MS_PER_DAY = 1000 * 60 * 60 * 24

const statusLabels: Array<Omit<StatusSummary, 'count'>> = [
  { id: 'backlog', label: 'Backlog', segmentClassName: 'bg-slate-400', dotClassName: 'bg-slate-400' },
  { id: 'in-progress', label: 'In Progress', segmentClassName: 'bg-amber-500', dotClassName: 'bg-amber-500' },
  { id: 'review', label: 'Review', segmentClassName: 'bg-violet-500', dotClassName: 'bg-violet-500' },
  { id: 'done', label: 'Done', segmentClassName: 'bg-emerald-500', dotClassName: 'bg-emerald-500' },
]

const priorityClasses: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
  high: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200',
}

const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })

const parseDateOnly = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const getStartOfToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const getDaysUntilDue = (dueDate: string, today: Date) => (
  Math.ceil((parseDateOnly(dueDate).getTime() - today.getTime()) / MS_PER_DAY)
)

const formatDateOnly = (date: string) => dateFormatter.format(parseDateOnly(date))

const formatTimestamp = (date: string) => dateFormatter.format(new Date(date))

const getDueLabel = (daysUntilDue: number) => {
  if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)}d overdue`
  if (daysUntilDue === 0) return 'Due today'
  if (daysUntilDue === 1) return 'Due tomorrow'
  return `Due in ${daysUntilDue}d`
}

const getDueClassName = (daysUntilDue: number) => {
  if (daysUntilDue < 0) return 'text-rose-700 dark:text-rose-300'
  if (daysUntilDue <= 1) return 'text-amber-700 dark:text-amber-300'
  return 'text-slate-500 dark:text-slate-400'
}

const getInitials = (name: string) => (
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
)

const getAssigneeName = (usersById: Map<number, BoardUser>, task: Task) => (
  usersById.get(task.assigneeId)?.name ?? 'Unassigned'
)

const getStatusLabel = (status: TaskStatus) => status.replace('-', ' ')

const getAttentionTasks = (
  activeTasks: Task[],
  usersById: Map<number, BoardUser>,
  today: Date,
): AttentionTaskItem[] => (
  activeTasks
    .map((task) => {
      const daysUntilDue = getDaysUntilDue(task.dueDate, today)
      const urgencyScore =
        (daysUntilDue < 0 ? 100 : 0) +
        (task.priority === 'high' ? 30 : task.priority === 'medium' ? 10 : 0) +
        (task.status === 'review' ? 8 : 0) -
        daysUntilDue

      return {
        task,
        assigneeName: getAssigneeName(usersById, task),
        daysUntilDue,
        urgencyScore,
      }
    })
    .filter(({ task, daysUntilDue }) => (
      task.priority === 'high' || task.status === 'review' || daysUntilDue <= 2
    ))
    .sort((first, second) => second.urgencyScore - first.urgencyScore)
    .slice(0, 5)
    .map(({ task, assigneeName, daysUntilDue }) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      priorityClassName: priorityClasses[task.priority],
      assigneeName,
      statusLabel: getStatusLabel(task.status),
      dueLabel: getDueLabel(daysUntilDue),
      dueClassName: getDueClassName(daysUntilDue),
      dueDateLabel: formatDateOnly(task.dueDate),
    }))
)

const getRecentTasks = (
  tasks: Task[],
  usersById: Map<number, BoardUser>,
  today: Date,
): RecentTaskItem[] => (
  [...tasks]
    .sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt))
    .slice(0, 5)
    .map((task) => {
      const daysUntilDue = getDaysUntilDue(task.dueDate, today)

      return {
        id: task.id,
        title: task.title,
        priority: task.priority,
        priorityClassName: priorityClasses[task.priority],
        assigneeName: getAssigneeName(usersById, task),
        updatedLabel: formatTimestamp(task.updatedAt),
        dueLabel: getDueLabel(daysUntilDue),
        dueClassName: getDueClassName(daysUntilDue),
      }
    })
)

const getWorkload = (tasks: Task[], users: BoardUser[]): WorkloadMemberItem[] => (
  users
    .map((user) => {
      const assignedTasks = tasks.filter((task) => task.assigneeId === user.id)
      const active = assignedTasks.filter((task) => task.status !== 'done').length

      return {
        id: user.id,
        name: user.name,
        initials: getInitials(user.name),
        active,
        highPriority: assignedTasks.filter((task) => task.status !== 'done' && task.priority === 'high').length,
        completed: assignedTasks.filter((task) => task.status === 'done').length,
      }
    })
    .filter((member) => member.active > 0 || member.completed > 0)
    .sort((first, second) => second.active - first.active)
)

const getMetrics = ({
  active,
  completed,
  completion,
  dueSoon,
  inProgress,
  members,
  overdue,
  review,
  total,
}: {
  active: number
  completed: number
  completion: number
  dueSoon: number
  inProgress: number
  members: number
  overdue: number
  review: number
  total: number
}): DashboardMetric[] => [
  {
    label: 'Active tasks',
    value: active,
    detail: `${inProgress} in progress`,
    badge: 'Open work',
    icon: DashboardIcon,
    iconClassName: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200',
  },
  {
    label: 'Due now',
    value: overdue + dueSoon,
    detail: `${overdue} overdue, ${dueSoon} due soon`,
    badge: overdue > 0 ? 'Needs review' : 'On track',
    icon: BellIcon,
    iconClassName: overdue > 0
      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200'
      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  },
  {
    label: 'In review',
    value: review,
    detail: 'Waiting for feedback',
    badge: 'Quality gate',
    icon: BoardIcon,
    iconClassName: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200',
  },
  {
    label: 'Completion',
    value: `${completion}%`,
    detail: `${completed} of ${total} tasks done`,
    badge: `${members} members`,
    icon: AnalyticsIcon,
    iconClassName: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  },
]

export const useDashboardStats = (tasks: Task[], users: BoardUser[]) => (
  useMemo(() => {
    const today = getStartOfToday()
    const usersById = new Map(users.map((user) => [user.id, user]))
    const activeTasks = tasks.filter((task) => task.status !== 'done')
    const completed = tasks.filter((task) => task.status === 'done').length
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length
    const review = tasks.filter((task) => task.status === 'review').length
    const highPriorityActive = activeTasks.filter((task) => task.priority === 'high').length
    const overdue = activeTasks.filter((task) => getDaysUntilDue(task.dueDate, today) < 0).length
    const dueSoon = activeTasks.filter((task) => {
      const daysUntilDue = getDaysUntilDue(task.dueDate, today)
      return daysUntilDue >= 0 && daysUntilDue <= 2
    }).length
    const total = tasks.length
    const active = activeTasks.length
    const members = users.length
    const completion = total ? Math.round((completed / total) * 100) : 0
    const workload = getWorkload(tasks, users)

    return {
      total,
      active,
      inProgress,
      review,
      completed,
      members,
      completion,
      overdue,
      dueSoon,
      highPriorityActive,
      byStatus: statusLabels.map((status) => ({
        ...status,
        count: tasks.filter((task) => task.status === status.id).length,
      })),
      attentionTasks: getAttentionTasks(activeTasks, usersById, today),
      recentTasks: getRecentTasks(tasks, usersById, today),
      workload,
      maxActiveAssignments: Math.max(...workload.map((member) => member.active), 1),
      metrics: getMetrics({
        active,
        completed,
        completion,
        dueSoon,
        inProgress,
        members,
        overdue,
        review,
        total,
      }),
    }
  }, [tasks, users])
)
