import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useMockData } from '../../board/hooks/useMockData'
import { fetchNotifications } from '../../../services/notificationService'
import { useNotificationStore } from '../../../stores/notificationStore'

interface UseNotificationsOptions {
  onNewNotifications?: (count: number) => void
}

export function useNotifications({ onNewNotifications }: UseNotificationsOptions = {}) {
  const initialDataQuery = useMockData()
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  })
  const hydrateInitial = useNotificationStore((state) => state.hydrateInitial)
  const ingest = useNotificationStore((state) => state.ingest)

  useEffect(() => {
    if (initialDataQuery.data) {
      hydrateInitial(initialDataQuery.data.notifications)
    }
  }, [hydrateInitial, initialDataQuery.data])

  useEffect(() => {
    if (!query.data) return
    const addedCount = ingest(query.data)
    if (addedCount > 0) {
      onNewNotifications?.(addedCount)
    }
  }, [ingest, onNewNotifications, query.data])

  return query
}
