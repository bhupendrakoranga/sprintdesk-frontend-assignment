import type { RecentTaskItem } from '../types'

interface RecentUpdatesCardProps {
  items: RecentTaskItem[]
}

const RecentUpdatesCard = ({ items }: RecentUpdatesCardProps) => (
  <article className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent updates</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest movement across the sprint board</p>
    </div>

    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {items.map((item) => (
        <div key={item.id} className="grid min-w-0 gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              {item.assigneeName} - updated {item.updatedLabel}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.priorityClassName}`}>
              {item.priority}
            </span>
            <p className={`text-xs font-medium ${item.dueClassName}`}>{item.dueLabel}</p>
          </div>
        </div>
      ))}
    </div>
  </article>
)

export default RecentUpdatesCard
