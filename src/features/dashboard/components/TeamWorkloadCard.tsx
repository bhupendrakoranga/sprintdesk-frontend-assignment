import type { WorkloadMemberItem } from '../types'

interface TeamWorkloadCardProps {
  maxActiveAssignments: number
  members: WorkloadMemberItem[]
}

const TeamWorkloadCard = ({ maxActiveAssignments, members }: TeamWorkloadCardProps) => (
  <article className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">Team workload</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Active assignments by member</p>
    </div>

    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {members.map((member) => (
        <div key={member.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[12rem_minmax(0,1fr)_9rem] sm:items-center sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200">
              {member.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{member.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{member.completed} completed</p>
            </div>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-label={`${member.name} active workload`}
            aria-valuemin={0}
            aria-valuemax={Math.max(maxActiveAssignments, 1)}
            aria-valuenow={member.active}
          >
            <div
              className="h-full rounded-full bg-cyan-500"
              style={{ width: `${member.active ? Math.max(12, (member.active / maxActiveAssignments) * 100) : 0}%` }}
            />
          </div>
          <div className="flex min-w-0 items-center gap-2 text-sm sm:justify-start">
            <span className="shrink-0 whitespace-nowrap font-semibold text-slate-900 dark:text-white">{member.active} active</span>
            {member.highPriority > 0 ? (
              <span className="shrink-0 whitespace-nowrap rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">
                {member.highPriority} high
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  </article>
)

export default TeamWorkloadCard
