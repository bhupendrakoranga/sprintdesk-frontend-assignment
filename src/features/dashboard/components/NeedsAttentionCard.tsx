import { Link } from "react-router-dom";
import type { AttentionTaskItem } from "../types";

interface NeedsAttentionCardProps {
  items: AttentionTaskItem[];
}

const NeedsAttentionCard = ({ items }: NeedsAttentionCardProps) => (
  <article className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        Needs attention
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Sorted by due date, priority, and review status
      </p>
    </div>

    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {items.length > 0 ? (
        items.map((item) => (
          <Link
            key={item.id}
            to="/board"
            className="grid min-w-0 gap-3 px-5 py-4 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-indigo-600 dark:hover:bg-slate-800/70 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"
          >
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <p className="min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.priorityClassName}`}
                >
                  {item.priority}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {item.assigneeName} - {item.statusLabel}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
              <p className={`text-sm font-semibold ${item.dueClassName}`}>
                {item.dueLabel}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {item.dueDateLabel}
              </p>
            </div>
          </Link>
        ))
      ) : (
        <div className="px-5 py-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6">
          No urgent work right now.
        </div>
      )}
    </div>
  </article>
);

export default NeedsAttentionCard;