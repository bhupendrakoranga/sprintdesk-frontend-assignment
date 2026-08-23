import { Link } from 'react-router-dom'
import { AnalyticsIcon, BoardIcon } from '../../../utils/icons'

interface DashboardHeaderProps {
  eyebrow: string
  title: string
  description: string
}

const DashboardHeader = ({ eyebrow, title, description }: DashboardHeaderProps) => (
  <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
    <div className="min-w-0">
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>

    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
      <Link
        to="/board"
        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
      >
        <BoardIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Open board</span>
      </Link>
      <Link
        to="/analytics"
        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 sm:w-auto"
      >
        <AnalyticsIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Analytics</span>
      </Link>
    </div>
  </section>
)

export default DashboardHeader
