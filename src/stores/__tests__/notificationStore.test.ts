import { beforeEach, describe, expect, it } from 'vitest'
import type { BoardNotification } from '../../features/board/types'
import { useNotificationStore } from '../notificationStore'

const initialNotification: BoardNotification = {
  id: 101,
  title: 'Task assigned',
  message: 'A task was assigned to you.',
  type: 'task',
  read: false,
  createdAt: '2026-08-19T11:10:00Z',
}

describe('notification store', () => {
  beforeEach(() => {
    localStorage.clear()
    useNotificationStore.setState({ notifications: [], isInitialized: false })
  })

  it('hydrates initial notifications and ignores duplicate feed IDs', () => {
    useNotificationStore.getState().hydrateInitial([initialNotification])
    const added = useNotificationStore.getState().ingest([
      { ...initialNotification, title: 'Duplicate' },
      { ...initialNotification, id: 1, title: 'New post' },
    ])

    expect(added).toBe(1)
    expect(useNotificationStore.getState().notifications).toHaveLength(2)
  })

  it('marks one notification and all notifications as read', () => {
    useNotificationStore.getState().hydrateInitial([initialNotification, { ...initialNotification, id: 102 }])

    useNotificationStore.getState().markAsRead(101)
    expect(useNotificationStore.getState().notifications.find((item) => item.id === 101)?.read).toBe(true)

    useNotificationStore.getState().markAllAsRead()
    expect(useNotificationStore.getState().notifications.every((item) => item.read)).toBe(true)
  })
})
