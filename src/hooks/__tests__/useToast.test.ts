import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(1)
    vi.spyOn(Math, 'random').mockReturnValue(0.123456789)
    useToast.getState().clearToasts()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('adds a toast with default values and returns the toast id', () => {
    const toastId = useToast.getState().showToast({ title: 'New activity' })

    expect(toastId).toBe('1-4fzzzxjy')
    expect(useToast.getState().toasts).toEqual([
      {
        id: toastId,
        title: 'New activity',
        tone: 'info',
        duration: 5000,
      },
    ])
  })

  it('dismisses a toast by id', () => {
    const toastId = useToast.getState().showToast({
      title: 'Saved',
      message: 'Your changes were saved.',
      tone: 'success',
    })

    useToast.getState().dismissToast(toastId)

    expect(useToast.getState().toasts).toEqual([])
  })
})
