import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoardNotification } from '../features/board/types'

interface NotificationState {
  notifications: BoardNotification[]
  isInitialized: boolean
  hydrateInitial: (notifications: BoardNotification[]) => void
  ingest: (notifications: BoardNotification[]) => number
  markAsRead: (notificationId: number) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isInitialized: false,
      hydrateInitial: (notifications) =>
        set((state) => {
          if (state.isInitialized) return state
          const existingIds = new Set(state.notifications.map((notification) => notification.id))
          return {
            notifications: [
              ...state.notifications,
              ...notifications.filter((notification) => !existingIds.has(notification.id)),
            ],
            isInitialized: true,
          }
        }),
      ingest: (notifications) => {
        const existingIds = new Set(get().notifications.map((notification) => notification.id))
        const newNotifications = notifications.filter((notification) => !existingIds.has(notification.id))
        if (newNotifications.length > 0) {
          set((state) => ({ notifications: [...newNotifications, ...state.notifications] }))
        }
        return newNotifications.length
      },
      markAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification,
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
        })),
    }),
    {
      name: 'sprintdesk.notifications',
      partialize: (state) => ({
        notifications: state.notifications,
        isInitialized: state.isInitialized,
      }),
    },
  ),
)
