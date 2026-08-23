import { Link, NavLink } from "react-router-dom";
import { navigationItems } from "./navigation";

const Sidebar = () => {
  return (
    <div>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 font-bold tracking-tight text-slate-900 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm text-white">
              S
            </span>
            SprintDesk
          </Link>
        </div>

        <nav
          className="flex-1 space-y-1 px-4 py-6"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => {
            const Icon = item.Icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Sprint planning
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Organize work and track progress
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
