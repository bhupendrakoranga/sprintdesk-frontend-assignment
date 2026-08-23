import MainLayout from '../../components/layout/MainLayout'
import Skeleton from '../../components/ui/Skeleton'
import { useBoardStore } from '../../stores/boardStore'
import { useMockData } from '../board/hooks/useMockData'
import DashboardHeader from './components/DashboardHeader'
import MetricsGrid from './components/MetricsGrid'
import NeedsAttentionCard from './components/NeedsAttentionCard'
import RecentUpdatesCard from './components/RecentUpdatesCard'
import SprintProgressCard from './components/SprintProgressCard'
import TeamWorkloadCard from './components/TeamWorkloadCard'
import TodaysFocusCard from './components/TodaysFocusCard'
import { useDashboardStats } from './hooks/useDashboardStats'

const DashboardPage = () => {
  const { isLoading, isError, error } = useMockData()
  const tasks = useBoardStore((state) => state.tasks)
  const users = useBoardStore((state) => state.users)
  const isHydrated = useBoardStore((state) => state.isHydrated)
  const stats = useDashboardStats(tasks, users)

  if (isLoading || !isHydrated) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton lines={3} className="max-w-xl" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-32 rounded-xl" lines={3} />
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.8fr)]">
            <Skeleton className="h-72 rounded-xl" lines={5} />
            <Skeleton className="h-72 rounded-xl" lines={5} />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (isError) {
    return (
      <MainLayout>
        <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700" role="alert">
          Unable to load dashboard data: {error instanceof Error ? error.message : 'Please try again.'}
        </section>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader
          eyebrow="Sprint command center"
          title="Dashboard"
          description="Track sprint health, urgent work, and team load from one focused view."
        />

        <MetricsGrid metrics={stats.metrics} />

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.8fr)]">
          <SprintProgressCard
            active={stats.active}
            completed={stats.completed}
            completion={stats.completion}
            statuses={stats.byStatus}
            total={stats.total}
          />
          <TodaysFocusCard
            active={stats.active}
            dueSoon={stats.dueSoon}
            highPriorityActive={stats.highPriorityActive}
            overdue={stats.overdue}
            review={stats.review}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <NeedsAttentionCard items={stats.attentionTasks} />
          <RecentUpdatesCard items={stats.recentTasks} />
        </section>

        <section>
          <TeamWorkloadCard
            maxActiveAssignments={stats.maxActiveAssignments}
            members={stats.workload}
          />
        </section>
      </div>
    </MainLayout>
  )
}

export default DashboardPage
