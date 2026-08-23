import type { IconComponent } from '../../utils/icons'
import type { TaskPriority, TaskStatus } from '../board/types'

export interface StatusSummary {
  id: TaskStatus
  label: string
  segmentClassName: string
  dotClassName: string
  count: number
}

export interface DashboardMetric {
  label: string
  value: number | string
  detail: string
  badge: string
  icon: IconComponent
  iconClassName: string
}

export interface AttentionTaskItem {
  id: number
  title: string
  priority: TaskPriority
  priorityClassName: string
  assigneeName: string
  statusLabel: string
  dueLabel: string
  dueClassName: string
  dueDateLabel: string
}

export interface RecentTaskItem {
  id: number
  title: string
  priority: TaskPriority
  priorityClassName: string
  assigneeName: string
  updatedLabel: string
  dueLabel: string
  dueClassName: string
}

export interface WorkloadMemberItem {
  id: number
  name: string
  initials: string
  active: number
  highPriority: number
  completed: number
}
