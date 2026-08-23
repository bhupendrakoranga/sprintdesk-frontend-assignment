interface FocusProgressProps {
  active: number
  colorClassName: string
  label: string
  value: number
  valueClassName: string
}

interface TodaysFocusCardProps {
  active: number
  dueSoon: number
  highPriorityActive: number
  overdue: number
  review: number
}

const FocusProgress = ({
  active,
  colorClassName,
  label,
  value,
  valueClassName,
}: FocusProgressProps) => (
  <div>
    <div className="flex items-baseline justify-between gap-3">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      <p className={`text-lg font-bold ${valueClassName}`}>{value}</p>
    </div>
    <div
      className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.max(active, 1)}
      aria-valuenow={value}
    >
      <div
        className={`h-full rounded-full ${colorClassName}`}
        style={{ width: `${Math.min(100, active ? (value / active) * 100 : 0)}%` }}
      />
    </div>
  </div>
)

const TodaysFocusCard = ({
  active,
  dueSoon,
  highPriorityActive,
  overdue,
  review,
}: TodaysFocusCardProps) => (
  <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Today's focus</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Highest risk work to clear first</p>
      </div>
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
        {highPriorityActive} high
      </span>
    </div>

    <div className="mt-5 space-y-4">
      <FocusProgress
        active={active}
        colorClassName="bg-rose-500"
        label="Overdue"
        value={overdue}
        valueClassName="text-rose-700 dark:text-rose-300"
      />
      <FocusProgress
        active={active}
        colorClassName="bg-amber-500"
        label="Due soon"
        value={dueSoon}
        valueClassName="text-amber-700 dark:text-amber-300"
      />
      <FocusProgress
        active={active}
        colorClassName="bg-violet-500"
        label="Review queue"
        value={review}
        valueClassName="text-violet-700 dark:text-violet-300"
      />
    </div>
  </article>
)

export default TodaysFocusCard
