import mockData from '../data/mock-data.json'
import type { MockData } from '../features/board/types'

const sourceData = mockData as MockData

export async function getMockData(): Promise<MockData> {
  return structuredClone(sourceData)
}
