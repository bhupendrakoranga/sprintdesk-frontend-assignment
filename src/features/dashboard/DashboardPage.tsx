import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import Skeleton from '../../components/ui/Skeleton'
import { useBoardStore } from '../../stores/boardStore'
import { useMockData } from '../board/hooks/useMockData'

const statusLabels = [
  { id: 'backlog' as const, label: 'Backlog' },
  { id: 'in-progress' as const, label: 'In Progress' },
  { id: 'review' as const, label: 'Review' },
  { id: 'done' as const, label: 'Done' },
]

const DashboardPage = () => {
  const { isLoading, isError, error } = useMockData()
  const tasks = useBoardStore((state) => state.tasks)
  const users = useBoardStore((state) => state.users)
  const isHydrated = useBoardStore((state) => state.isHydrated)

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'done').length
    return {
      total: tasks.length,
      inProgress: tasks.filter((task) => task.status === 'in-progress').length,
      completed,
      members: users.length,
      completion: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
      byStatus: statusLabels.map((status) => ({
        ...status,
        count: tasks.filter((task) => task.status === status.id).length,
      })),
    }
  }, [tasks, users.length])

  if (isLoading || !isHydrated) {
    return <MainLayout><div className="mx-auto max-w-7xl space-y-8"><Skeleton lines={3} className="max-w-xl" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-36 rounded-xl" lines={3} />)}</div><Skeleton className="h-64 rounded-xl" lines={5} /></div></MainLayout>
  }

  if (isError) {
    return <MainLayout><section className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700" role="alert">Unable to load dashboard data: {error instanceof Error ? error.message : 'Please try again.'}</section></MainLayout>
  }

  const metrics = [
    { label: 'Total tasks', value: stats.total, detail: 'Tasks in the sprint', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'In progress', value: stats.inProgress, detail: 'Currently being worked on', color: 'bg-amber-50 text-amber-700' },
    { label: 'Completed', value: stats.completed, detail: 'Finished this sprint', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Team members', value: stats.members, detail: 'People on this workspace', color: 'bg-sky-50 text-sky-700' },
  ]

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-600">Sprint overview</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">A central view of your sprint progress, tasks, and team activity.</p>
        </div>
        <Link to="/board" className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 dark:hover:bg-indigo-900 sm:shrink-0">Open board</Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Sprint metrics">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <p className="min-w-0 text-sm font-medium text-slate-500">{metric.label}</p>
              <span className={'shrink-0 rounded-full px-2 py-1 text-xs font-semibold ' + metric.color}>{metric.label === 'Completed' ? String(stats.completion) + '%' : 'Live'}</span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{metric.value}</p>
            <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Sprint progress</h2>
              <p className="mt-1 text-sm text-slate-500">{String(stats.completion)}% of tasks completed</p>
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{String(stats.completion)}%</span>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-label={'Sprint progress: ' + String(stats.completion) + ' percent'}>
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: String(stats.completion) + '%' }} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.byStatus.map((status) => (
              <div key={status.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs text-slate-500">{status.label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100">{status.count}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Getting started</h2>
          <p className="mt-1 text-sm text-slate-500">Your sprint workspace is ready for task data.</p>
          <div className="mt-6 space-y-4">
            {[['Connect your sprint data', '/board'], ['Review analytics', '/analytics'], ['Move work across the board', '/board']].map(([item, href], index) => (
              <Link key={item} to={href} className="flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-indigo-600">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">{index + 1}</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
              </Link>
            ))}
          </div>
        </article>
      </section>
      </div>
    </MainLayout>
  )
}

export default DashboardPage
