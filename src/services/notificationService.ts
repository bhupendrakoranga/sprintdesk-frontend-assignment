import type { BoardNotification } from '../features/board/types'

interface JsonPlaceholderPost {
  id: number
  title: string
  body: string
}

const NOTIFICATIONS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5'

export async function fetchNotifications(): Promise<BoardNotification[]> {
  const response = await fetch(NOTIFICATIONS_URL)
  if (!response.ok) {
    throw new Error('Unable to load notifications.')
  }

  const posts = (await response.json()) as JsonPlaceholderPost[]
  return posts.map((post) => ({
    id: post.id,
    title: 'New activity',
    message: post.title,
    type: 'post',
    read: false,
    createdAt: new Date().toISOString(),
  }))
}
