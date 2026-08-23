
const AuthLayout = () => {
  return (
    <div className="mb-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-end justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-sm dark:border-slate-700 dark:bg-white">
        <span className="h-7 w-2 rounded-sm bg-emerald-400" aria-hidden="true" />
        <span className="h-10 w-2 rounded-sm bg-indigo-400" aria-hidden="true" />
        <span className="h-5 w-2 rounded-sm bg-amber-300" aria-hidden="true" />
        <span className="h-8 w-2 rounded-sm bg-rose-400" aria-hidden="true" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="h-px w-8 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          SprintDesk
        </p>
        <span className="h-px w-8 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
      </div>

      <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
        Welcome back
      </h1>

      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
        Plan the next sprint, review progress, and keep your team aligned.
      </p>

      <div className="mx-auto mt-5 grid max-w-40 grid-cols-3 gap-2" aria-hidden="true">
        <span className="h-1.5 rounded-full bg-emerald-400" />
        <span className="h-1.5 rounded-full bg-indigo-400" />
        <span className="h-1.5 rounded-full bg-amber-300" />
      </div>
    </div>
  );
};

export default AuthLayout;
