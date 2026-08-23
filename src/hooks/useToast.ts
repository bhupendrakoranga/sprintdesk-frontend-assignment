import { create } from 'zustand'

export type ToastTone = 'info' | 'success' | 'warning' | 'error'

export interface ToastMessage {
  id: string
  title: string
  message?: string
  tone: ToastTone
  duration: number
}

interface ToastInput {
  title: string
  message?: string
  tone?: ToastTone
  duration?: number
}

interface ToastState {
  toasts: ToastMessage[]
  showToast: (toast: ToastInput) => string
  dismissToast: (toastId: string) => void
  clearToasts: () => void
}

const DEFAULT_TOAST_DURATION = 5000

const createToastId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  showToast: ({ title, message, tone = 'info', duration = DEFAULT_TOAST_DURATION }) => {
    const toast: ToastMessage = {
      id: createToastId(),
      title,
      message,
      tone,
      duration,
    }

    set((state) => ({
      toasts: [toast, ...state.toasts].slice(0, 5),
    }))

    return toast.id
  },
  dismissToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),
  clearToasts: () => set({ toasts: [] }),
}))
