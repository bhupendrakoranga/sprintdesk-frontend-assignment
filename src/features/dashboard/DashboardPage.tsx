import { useMemo } from "react";
import MainLayout from "../../components/layout/MainLayout";
import Skeleton from "../../components/ui/Skeleton";
import { useBoardStore } from "../../stores/boardStore";
import {
  AnalyticsIcon,
  BellIcon,
  BoardIcon,
  DashboardIcon,
} from "../../utils/icons";
import { useMockData } from "../board/hooks/useMockData";
import type { BoardUser, Task, TaskPriority, TaskStatus } from "../board/types";
import DashboardHeader from "./components/DashboardHeader";
import MetricsGrid from "./components/MetricsGrid";
import NeedsAttentionCard from "./components/NeedsAttentionCard";
import RecentUpdatesCard from "./components/RecentUpdatesCard";
import SprintProgressCard from "./components/SprintProgressCard";
import TeamWorkloadCard from "./components/TeamWorkloadCard";
import TodaysFocusCard from "./components/TodaysFocusCard";
import type { DashboardMetric, StatusSummary } from "./types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const statusLabels: Array<Omit<StatusSummary, "count">> = [
  {
    id: "backlog",
    label: "Backlog",
    segmentClassName: "bg-slate-400",
    dotClassName: "bg-slate-400",
  },
  {
    id: "in-progress",
    label: "In Progress",
    segmentClassName: "bg-amber-500",
    dotClassName: "bg-amber-500",
  },
  {
    id: "review",
    label: "Review",
    segmentClassName: "bg-violet-500",
    dotClassName: "bg-violet-500",
  },
  {
    id: "done",
    label: "Done",
    segmentClassName: "bg-emerald-500",
    dotClassName: "bg-emerald-500",
  },
];

const priorityClasses: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  high: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
});

const parseDateOnly = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getStartOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const getDaysUntilDue = (dueDate: string, today: Date) =>
  Math.ceil((parseDateOnly(dueDate).getTime() - today.getTime()) / MS_PER_DAY);

const formatDateOnly = (date: string) =>
  dateFormatter.format(parseDateOnly(date));

const formatTimestamp = (date: string) => dateFormatter.format(new Date(date));

const getDueLabel = (daysUntilDue: number) => {
  if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)}d overdue`;
  if (daysUntilDue === 0) return "Due today";
  if (daysUntilDue === 1) return "Due tomorrow";
  return `Due in ${daysUntilDue}d`;
};

const getDueClassName = (daysUntilDue: number) => {
  if (daysUntilDue < 0) return "text-rose-700 dark:text-rose-300";
  if (daysUntilDue <= 1) return "text-amber-700 dark:text-amber-300";
  return "text-slate-500 dark:text-slate-400";
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getAssigneeName = (usersById: Map<number, BoardUser>, task: Task) =>
  usersById.get(task.assigneeId)?.name ?? "Unassigned";

const getStatusLabel = (status: TaskStatus) => status.replace("-", " ");

const DashboardPage = () => {
  const { isLoading, isError, error } = useMockData();
  const tasks = useBoardStore((state) => state.tasks);
  const users = useBoardStore((state) => state.users);
  const isHydrated = useBoardStore((state) => state.isHydrated);

  const stats = useMemo(() => {
    const today = getStartOfToday();
    const usersById = new Map(users.map((user) => [user.id, user]));
    const activeTasks = tasks.filter((task) => task.status !== "done");
    const completed = tasks.filter((task) => task.status === "done").length;
    const inProgress = tasks.filter(
      (task) => task.status === "in-progress",
    ).length;
    const review = tasks.filter((task) => task.status === "review").length;
    const highPriorityActive = activeTasks.filter(
      (task) => task.priority === "high",
    ).length;
    const overdueTasks = activeTasks.filter(
      (task) => getDaysUntilDue(task.dueDate, today) < 0,
    );
    const dueSoonTasks = activeTasks.filter((task) => {
      const daysUntilDue = getDaysUntilDue(task.dueDate, today);
      return daysUntilDue >= 0 && daysUntilDue <= 2;
    });

    const attentionTasks = activeTasks
      .map((task) => {
        const daysUntilDue = getDaysUntilDue(task.dueDate, today);
        const urgencyScore =
          (daysUntilDue < 0 ? 100 : 0) +
          (task.priority === "high"
            ? 30
            : task.priority === "medium"
              ? 10
              : 0) +
          (task.status === "review" ? 8 : 0) -
          daysUntilDue;

        return {
          task,
          assigneeName: getAssigneeName(usersById, task),
          daysUntilDue,
          urgencyScore,
        };
      })
      .filter(
        ({ task, daysUntilDue }) =>
          task.priority === "high" ||
          task.status === "review" ||
          daysUntilDue <= 2,
      )
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
      }));

    const recentTasks = [...tasks]
      .sort(
        (first, second) =>
          Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
      )
      .slice(0, 5)
      .map((task) => {
        const daysUntilDue = getDaysUntilDue(task.dueDate, today);

        return {
          id: task.id,
          title: task.title,
          priority: task.priority,
          priorityClassName: priorityClasses[task.priority],
          assigneeName: getAssigneeName(usersById, task),
          updatedLabel: formatTimestamp(task.updatedAt),
          dueLabel: getDueLabel(daysUntilDue),
          dueClassName: getDueClassName(daysUntilDue),
        };
      });

    const workload = users
      .map((user) => {
        const assignedTasks = tasks.filter(
          (task) => task.assigneeId === user.id,
        );
        const active = assignedTasks.filter(
          (task) => task.status !== "done",
        ).length;
        return {
          id: user.id,
          name: user.name,
          initials: getInitials(user.name),
          active,
          highPriority: assignedTasks.filter(
            (task) => task.status !== "done" && task.priority === "high",
          ).length,
          completed: assignedTasks.filter((task) => task.status === "done")
            .length,
        };
      })
      .filter((member) => member.active > 0 || member.completed > 0)
      .sort((first, second) => second.active - first.active);

    return {
      total: tasks.length,
      active: activeTasks.length,
      inProgress,
      review,
      completed,
      members: users.length,
      completion: tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0,
      overdue: overdueTasks.length,
      dueSoon: dueSoonTasks.length,
      highPriorityActive,
      byStatus: statusLabels.map((status) => ({
        ...status,
        count: tasks.filter((task) => task.status === status.id).length,
      })),
      attentionTasks,
      recentTasks,
      workload,
      maxActiveAssignments: Math.max(
        ...workload.map((member) => member.active),
        1,
      ),
    };
  }, [tasks, users]);

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
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <section
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"
          role="alert"
        >
          Unable to load dashboard data:{" "}
          {error instanceof Error ? error.message : "Please try again."}
        </section>
      </MainLayout>
    );
  }

  const metrics: DashboardMetric[] = [
    {
      label: "Active tasks",
      value: stats.active,
      detail: `${stats.inProgress} in progress`,
      badge: "Open work",
      icon: DashboardIcon,
      iconClassName: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200",
    },
    {
      label: "Due now",
      value: stats.overdue + stats.dueSoon,
      detail: `${stats.overdue} overdue, ${stats.dueSoon} due soon`,
      badge: stats.overdue > 0 ? "Needs review" : "On track",
      icon: BellIcon,
      iconClassName:
        stats.overdue > 0
          ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    },
    {
      label: "In review",
      value: stats.review,
      detail: "Waiting for feedback",
      badge: "Quality gate",
      icon: BoardIcon,
      iconClassName:
        "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200",
    },
    {
      label: "Completion",
      value: `${stats.completion}%`,
      detail: `${stats.completed} of ${stats.total} tasks done`,
      badge: `${stats.members} members`,
      icon: AnalyticsIcon,
      iconClassName:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    },
  ];

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader
          eyebrow="Sprint command center"
          title="Dashboard"
          description="Track sprint health, urgent work, and team load from one focused view."
        />

        <MetricsGrid metrics={metrics} />

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
  );
};

export default DashboardPage;
