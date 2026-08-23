import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DataTable, { type DataTableColumn } from '../../components/ui/DataTable'
import Skeleton from '../../components/ui/Skeleton'
import MainLayout from '../../components/layout/MainLayout'
import { useBoardStore } from '../../stores/boardStore'
import { useMockData } from '../board/hooks/useMockData'
import type { TaskStatus } from '../board/types'

const statusColumns: Array<{ id: TaskStatus; label: string }> = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
]
const priorities = ['low', 'medium', 'high'] as const
const chartColors = ['#6366f1', '#f59e0b', '#8b5cf6', '#10b981']

interface SprintRow {
  id: number
  name: string
  completed: number
  total: number
}

const AnalyticsPage = () => {
  const { data, isLoading, isError, error } = useMockData()
  const tasks = useBoardStore((state) => state.tasks)
  const isHydrated = useBoardStore((state) => state.isHydrated)

  const statusData = useMemo(
    () => statusColumns.map((column) => ({
      name: column.label,
      value: tasks.filter((task) => task.status === column.id).length,
    })),
    [tasks],
  )
  const priorityData = useMemo(
    () => priorities.map((priority) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      backlog: tasks.filter((task) => task.priority === priority && task.status === 'backlog').length,
      inProgress: tasks.filter((task) => task.priority === priority && task.status === 'in-progress').length,
      review: tasks.filter((task) => task.priority === priority && task.status === 'review').length,
      done: tasks.filter((task) => task.priority === priority && task.status === 'done').length,
    })),
    [tasks],
  )
  const velocityData = useMemo(
    () => (data?.sprints ?? []).map((sprint) => ({
      name: sprint.name,
      completed: tasks.filter((task) => task.sprintId === sprint.id && task.status === 'done').length,
    })),
    [data?.sprints, tasks],
  )
  const completionTrend = useMemo(() => {
    const completedByDate = new Map<string, number>()
    tasks.forEach((task) => {
      if (task.completedAt) {
        const date = task.completedAt.slice(0, 10)
        completedByDate.set(date, (completedByDate.get(date) ?? 0) + 1)
      }
    })
    return [...completedByDate.entries()]
      .sort(([first], [second]) => first.localeCompare(second))
      .reduce<Array<{ date: string; completed: number; cumulative: number }>>((trend, [date, count]) => {
        const cumulative = (trend.at(-1)?.cumulative ?? 0) + count
        return [...trend, { date: date.slice(5), completed: count, cumulative }]
      }, [])
  }, [tasks])
  const sprintRows = useMemo<SprintRow[]>(
    () => (data?.sprints ?? []).map((sprint) => ({
      id: sprint.id,
      name: sprint.name,
      completed: tasks.filter((task) => task.sprintId === sprint.id && task.status === 'done').length,
      total: tasks.filter((task) => task.sprintId === sprint.id).length,
    })),
    [data?.sprints, tasks],
  )

  const tableColumns: DataTableColumn<SprintRow>[] = [
    { key: 'name', header: 'Sprint', render: (row) => row.name },
    { key: 'completed', header: 'Completed', render: (row) => row.completed },
    { key: 'total', header: 'Total tasks', render: (row) => row.total },
    { key: 'completion', header: 'Completion', render: (row) => String(row.total ? Math.round((row.completed / row.total) * 100) : 0) + '%' },
  ]

  if (isLoading || !isHydrated) {
    return <MainLayout><div className="mx-auto max-w-7xl space-y-5"><Skeleton lines={3} className="max-w-md" /><div className="grid gap-5 lg:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-64 rounded-xl" lines={5} />)}</div></div></MainLayout>
  }

  if (isError) {
    return <MainLayout><section className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700" role="alert">Unable to load analytics data: {error instanceof Error ? error.message : 'Please try again.'}</section></MainLayout>
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-5">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
        <p className="text-sm font-medium text-indigo-600">Sprint insights</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Charts are derived from the live Zustand board state and update after task changes.</p>
        </div>
      </section>

      <section className="grid min-w-0 gap-5 lg:grid-cols-2">
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Sprint velocity</h2>
          <p className="mt-1 text-sm text-slate-500">Completed tasks per sprint</p>
          <div className="mt-4 h-60 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Task status</h2>
          <p className="mt-1 text-sm text-slate-500">Current distribution across columns</p>
          <div className="mt-4 h-60 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="72%" label animationDuration={700}>
                  {statusData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Priority breakdown</h2>
          <p className="mt-1 text-sm text-slate-500">Priority across each workflow stage</p>
          <div className="mt-4 h-60 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="priority" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="backlog" name="Backlog" stackId="status" fill="#94a3b8" animationDuration={700} />
                <Bar dataKey="inProgress" name="In Progress" stackId="status" fill="#f59e0b" animationDuration={700} />
                <Bar dataKey="review" name="Review" stackId="status" fill="#8b5cf6" animationDuration={700} />
                <Bar dataKey="done" name="Done" stackId="status" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Completion trend</h2>
          <p className="mt-1 text-sm text-slate-500">Completed tasks over time</p>
          <div className="mt-4 h-60 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" name="Completed that day" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} animationDuration={700} />
                <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} animationDuration={700} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Sprint summary</h2>
        <DataTable rows={sprintRows} columns={tableColumns} getRowKey={(row) => row.id} />
      </section>
      </div>
    </MainLayout>
  )
}

export default AnalyticsPage
