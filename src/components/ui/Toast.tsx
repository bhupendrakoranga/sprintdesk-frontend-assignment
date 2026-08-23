import { useEffect } from 'react'
import { useToast, type ToastMessage } from '../../hooks/useToast'

const toneClassNames: Record<ToastMessage['tone'], string> = {
  info: 'border-indigo-200 bg-indigo-50 text-indigo-950 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-50',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-50',
  warning: 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-50',
  error: 'border-red-200 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950 dark:text-red-50',
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const dismissToast = useToast((state) => state.dismissToast)

  useEffect(() => {
    if (toast.duration <= 0) return undefined

    const timeoutId = window.setTimeout(() => dismissToast(toast.id), toast.duration)
    return () => window.clearTimeout(timeoutId)
  }, [dismissToast, toast.duration, toast.id])

  return (
    <li
      className={`w-full rounded-lg border px-4 py-3 shadow-lg ${toneClassNames[toast.tone]}`}
      role={toast.tone === 'error' ? 'alert' : 'status'}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message && <p className="mt-1 text-sm opacity-80">{toast.message}</p>}
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-current"
          onClick={() => dismissToast(toast.id)}
          aria-label="Dismiss notification"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </li>
  )
}

export default function Toast() {
  const toasts = useToast((state) => state.toasts)

  if (toasts.length === 0) return null

  return (
    <ol
      className="fixed bottom-4 right-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </ol>
  )
}
