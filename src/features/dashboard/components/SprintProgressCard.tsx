import type { StatusSummary } from '../types'

interface SprintProgressCardProps {
  active: number
  completed: number
  completion: number
  statuses: StatusSummary[]
  total: number
}

const SprintProgressCard = ({
  active,
  completed,
  completion,
  statuses,
  total,
}: SprintProgressCardProps) => (
  <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Sprint progress</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {completed} completed, {active} still active
        </p>
      </div>
      <div className="shrink-0 rounded-md bg-emerald-50 px-3 py-2 text-left sm:text-right dark:bg-emerald-950">
        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-200">Completion</p>
        <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-100">{completion}%</p>
      </div>
    </div>

    <div
      className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      aria-label={`Sprint progress: ${completion} percent complete`}
    >
      {statuses.map((status) => (
        <div
          key={status.id}
          className={status.segmentClassName}
          style={{ width: `${total ? (status.count / total) * 100 : 0}%` }}
        />
      ))}
    </div>

    <div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
      {statuses.map((status) => (
        <div key={status.id} className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.dotClassName}`} />
            <p className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">{status.label}</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{status.count}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {total ? Math.round((status.count / total) * 100) : 0}% of total
          </p>
        </div>
      ))}
    </div>
  </article>
)

export default SprintProgressCard
