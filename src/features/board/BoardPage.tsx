import { useCallback, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import MainLayout from '../../components/layout/MainLayout'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Skeleton from '../../components/ui/Skeleton'
import { useBoardStore } from '../../stores/boardStore'
import { useMockData } from './hooks/useMockData'
import type { Task, TaskPriority, TaskStatus } from './types'
import { BoardColumn } from './components/BoardColumn'
import { TaskCardPreview } from './components/TaskCard'
import { TaskDrawer } from './components/TaskDrawer'
import { TaskFormModal } from './components/TaskFormModal'
import { getTaskStatusFromDropTarget } from './utils'

const columns: Array<{ id: TaskStatus; label: string; color: string }> = [
  { id: 'backlog', label: 'Backlog', color: 'bg-slate-400' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-amber-500' },
  { id: 'review', label: 'Review', color: 'bg-violet-500' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500' },
]

const priorityClasses: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-red-50 text-red-700',
}

const BoardPage = () => {
  const { isLoading, isError, error } = useMockData()
  const tasks = useBoardStore((state) => state.tasks)
  const users = useBoardStore((state) => state.users)
  const comments = useBoardStore((state) => state.comments)
  const isHydrated = useBoardStore((state) => state.isHydrated)
  const moveTask = useBoardStore((state) => state.moveTask)
  const addTask = useBoardStore((state) => state.addTask)
  const updateTask = useBoardStore((state) => state.updateTask)
  const deleteTask = useBoardStore((state) => state.deleteTask)
  const addComment = useBoardStore((state) => state.addComment)
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const tasksByStatus = useMemo(() => {
    return columns.reduce<Record<TaskStatus, Task[]>>((result, column) => {
      result[column.id] = tasks
        .filter((task) => task.status === column.id)
        .sort((first, second) => first.order - second.order)
      return result
    }, { backlog: [], 'in-progress': [], review: [], done: [] })
  }, [tasks])

  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeTaskId) ?? null,
    [activeTaskId, tasks],
  )
  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks],
  )

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveTaskId(Number(active.id))
  }, [])

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveTaskId(null)

    const nextStatus = getTaskStatusFromDropTarget(tasks, over?.id)
    if (!nextStatus) return

    const overTaskId = tasks.some((task) => String(task.id) === String(over?.id))
      ? Number(over?.id)
      : undefined
    moveTask(Number(active.id), nextStatus, overTaskId)
  }, [moveTask, tasks])

  const handleDragCancel = useCallback(() => setActiveTaskId(null), [])
  const handleOpenTask = useCallback((task: Task) => setSelectedTaskId(task.id), [])
  const handleSaveTask = useCallback((taskId: number, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'assigneeId' | 'dueDate'>>) => {
    updateTask(taskId, updates)
  }, [updateTask])
  const handleAddComment = useCallback((taskId: number, message: string) => {
    addComment({ taskId, authorId: 1, message })
  }, [addComment])
  const handleCreateTask = useCallback((task: Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt' | 'completedAt'>) => {
    addTask(task)
    setIsCreateModalOpen(false)
  }, [addTask])
  const handleConfirmDelete = useCallback(() => {
    if (!taskToDelete) return
    deleteTask(taskToDelete.id)
    setTaskToDelete(null)
    setSelectedTaskId(null)
  }, [deleteTask, taskToDelete])

  if (isLoading || !isHydrated) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="max-w-md" lines={3} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {columns.map((column) => <Skeleton key={column.id} className="h-96 rounded-xl" lines={5} />)}
          </div>
        </div>
      </MainLayout>
    )
  }

  if (isError) {
    return (
      <MainLayout>
        <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700" role="alert">
          Unable to load board data: {error instanceof Error ? error.message : 'Please try again.'}
        </section>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto flex h-[calc(100dvh-6.5rem)] max-w-7xl min-h-0 flex-col gap-6 overflow-hidden sm:h-[calc(100dvh-7.5rem)] lg:h-[calc(100dvh-8.5rem)]">
      <section className="shrink-0 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <p className="text-sm font-medium text-indigo-600">Sprint workspace</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Board</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Move tasks across the sprint workflow by dragging or using the keyboard.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:justify-end">
          <div className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-100/70 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 sm:w-auto sm:min-w-40 sm:gap-6">
            <span className="font-medium text-slate-500 dark:text-slate-400">Total tasks</span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">{tasks.length}</span>
          </div>
          <Button
            type="button"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create task +
          </Button>
        </div>
      </section>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <section className="grid min-h-0 flex-1 grid-cols-[repeat(4,minmax(17rem,1fr))] gap-4 overflow-x-auto pb-2" aria-label="Sprint task board">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id]}
              users={users}
              priorityClasses={priorityClasses}
              onOpenTask={handleOpenTask}
            />
          ))}
        </section>

        <DragOverlay>
          {activeTask ? (
            <TaskCardPreview task={activeTask} users={users} priorityClasses={priorityClasses} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDrawer
        key={selectedTask?.id ?? 'empty'}
        task={selectedTask}
        users={users}
        comments={comments}
        onClose={() => setSelectedTaskId(null)}
        onSave={handleSaveTask}
        onAddComment={handleAddComment}
        onDelete={setTaskToDelete}
      />
      <TaskFormModal
        key={isCreateModalOpen ? 'open' : 'closed'}
        isOpen={isCreateModalOpen}
        users={users}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
      <Modal
        isOpen={Boolean(taskToDelete)}
        title="Delete task?"
        onClose={() => setTaskToDelete(null)}
        footer={(
          <>
            <Button type="button" variant="outline" onClick={() => setTaskToDelete(null)}>Cancel</Button>
            <Button type="button" variant="danger" onClick={handleConfirmDelete}>Delete task</Button>
          </>
        )}
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This will permanently remove <strong>{taskToDelete?.title}</strong> and its comments from the board.
        </p>
      </Modal>

      <p className="sr-only" aria-live="polite">
        {selectedTaskId ? `Task ${selectedTaskId} selected` : ''}
      </p>
      </div>
    </MainLayout>
  )
}

export default BoardPage
