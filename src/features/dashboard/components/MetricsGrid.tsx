import type { DashboardMetric } from "../types";

interface MetricsGridProps {
  metrics: DashboardMetric[];
}

const MetricsGrid = ({ metrics }: MetricsGridProps) => (
  <section
    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    aria-label="Sprint metrics"
  >
    {metrics.map((metric) => {
      const Icon = metric.icon;

      return (
        <article
          key={metric.label}
          className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-4">
            <span
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${metric.iconClassName}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="max-w-32 truncate rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {metric.badge}
            </span>
          </div>
          <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
            {metric.label}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {metric.value}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {metric.detail}
          </p>
        </article>
      );
    })}
  </section>
);

export default MetricsGrid;