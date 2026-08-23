import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMockData } from '../../../services/mockDataService'
import { useBoardStore } from '../../../stores/boardStore'

export const mockDataQueryKey = ['mock-data'] as const

export function useMockData() {
  const query = useQuery({
    queryKey: mockDataQueryKey,
    queryFn: getMockData,
    staleTime: Infinity,
  })
  const hydrateBoard = useBoardStore((state) => state.hydrateBoard)

  useEffect(() => {
    if (query.data) {
      hydrateBoard(query.data)
    }
  }, [hydrateBoard, query.data])

  return query
}
