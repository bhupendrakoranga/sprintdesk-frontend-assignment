import { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/ui/Button'
import Loader from '../../../components/ui/Loader'
import { useToast } from '../../../hooks/useToast'
import { useNotificationStore } from '../../../stores/notificationStore'
import { useNotifications } from '../hooks/useNotifications'

const PAGE_SIZE = 20

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(0)
  const showToast = useToast((state) => state.showToast)
  const handleNewNotifications = useCallback((count: number) => {
    if (isOpen) return

    showToast({
      title: count === 1 ? 'New notification' : `${count} new notifications`,
      message: 'Open the notification panel to review the latest activity.',
      tone: 'info',
    })
  }, [isOpen, showToast])
  const { isLoading, isError } = useNotifications({ onNewNotifications: handleNewNotifications })
  const notifications = useNotificationStore((state) => state.notifications)
  const markAsRead = useNotificationStore((state) => state.markAsRead)
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead)
  const unreadCount = notifications.filter((notification) => !notification.read).length
  const pageCount = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE))
  const visibleNotifications = useMemo(
    () => notifications.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [notifications, page],
  )

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={unreadCount ? 'Notifications, unread' : 'Notifications'}
        aria-expanded={isOpen}
        aria-controls="notification-panel"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17H9m10-2V11a7 7 0 1 0-14 0v4l-2 2h18l-2-2Zm-7 5h2" />
        </svg>
        {unreadCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <section
          id="notification-panel"
          className="fixed left-4 right-4 top-20 z-50 max-h-[calc(100dvh-6rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-none sm:w-[min(22rem,calc(100vw-2rem))]"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h2>
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            </div>
            <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={markAllAsRead} disabled={unreadCount === 0}>Mark all read</Button>
          </div>
          <div className="max-h-[calc(100dvh-13rem)] overflow-y-auto sm:max-h-96">
            {isLoading && <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500"><Loader height={8} width={3} color="#4f46e5" /> Loading...</div>}
            {isError && <p className="px-4 py-8 text-sm text-red-600" role="alert">Notifications are temporarily unavailable.</p>}
            {!isLoading && !isError && visibleNotifications.length === 0 && <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</p>}
            {!isLoading && !isError && visibleNotifications.map((notification) => (
              <button key={notification.id} type="button" className={'block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none dark:border-slate-800 dark:hover:bg-slate-800 ' + (notification.read ? '' : 'bg-indigo-50/60 dark:bg-indigo-950/30')} onClick={() => markAsRead(notification.id)}>
                <span className="flex items-start gap-3">
                  <span className={'mt-1 h-2 w-2 shrink-0 rounded-full ' + (notification.read ? 'bg-slate-300' : 'bg-indigo-600')} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{notification.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{notification.message}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
          {pageCount > 1 && (
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
              <Button type="button" variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((current) => current - 1)}>Previous</Button>
              <span className="shrink-0 text-xs text-slate-500">Page {page + 1} of {pageCount}</span>
              <Button type="button" variant="outline" size="sm" disabled={page === pageCount - 1} onClick={() => setPage((current) => current + 1)}>Next</Button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
