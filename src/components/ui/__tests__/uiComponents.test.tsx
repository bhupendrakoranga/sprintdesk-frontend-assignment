import { act } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Button from '../Button'
import DataTable, { type DataTableColumn } from '../DataTable'
import InputField from '../InputField'
import Modal from '../Modal'
import Select from '../Select'
import Skeleton from '../Skeleton'
import Toast from '../Toast'
import { useToast } from '../../../hooks/useToast'

describe('ui components', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    useToast.getState().clearToasts()
  })

  it('renders a disabled loading button', () => {
    render(<Button isLoading>Save</Button>)

    const button = screen.getByRole('button', { name: /please wait/i })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('links input labels and validation errors accessibly', () => {
    render(
      <InputField
        id="username"
        label="Username"
        error="Username is required"
        endAdornment={<button type="button">Clear</button>}
      />,
    )

    const input = screen.getByLabelText('Username')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Username is required')
    expect(screen.getByRole('alert')).toHaveTextContent('Username is required')
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
  })

  it('renders select options with the selected value', () => {
    render(
      <Select
        id="priority"
        label="Priority"
        value="high"
        onChange={() => undefined}
        options={[
          { label: 'Low', value: 'low' },
          { label: 'High', value: 'high' },
        ]}
      />,
    )

    expect(screen.getByLabelText('Priority')).toHaveValue('high')
    expect(screen.getByRole('option', { name: 'Low' })).toBeInTheDocument()
  })

  it('renders table rows and empty states', () => {
    interface Row {
      id: number
      name: string
    }

    const columns: DataTableColumn<Row>[] = [
      { key: 'name', header: 'Name', render: (row) => row.name },
    ]
    const { rerender } = render(
      <DataTable rows={[{ id: 1, name: 'Sprint 1' }]} columns={columns} getRowKey={(row) => row.id} />,
    )

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Sprint 1' })).toBeInTheDocument()

    rerender(<DataTable rows={[]} columns={columns} getRowKey={(row) => row.id} />)

    expect(screen.getByText('No data available.')).toBeInTheDocument()
  })

  it('renders modal content and calls onClose on escape', () => {
    const onClose = vi.fn()

    render(
      <Modal isOpen title="Delete task?" onClose={onClose}>
        This action cannot be undone.
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Delete task?' })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders skeleton loading state', () => {
    render(<Skeleton lines={2} />)

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('renders and dismisses toast notifications', async () => {
    const user = userEvent.setup()
    const toastId = useToast.getState().showToast({
      title: 'New notification',
      message: 'Open the panel to review activity.',
      duration: 0,
    })

    render(<Toast />)

    expect(screen.getByRole('status')).toHaveTextContent('New notification')
    expect(screen.getByText('Open the panel to review activity.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))

    expect(useToast.getState().toasts.some((toast) => toast.id === toastId)).toBe(false)
  })

  it('automatically removes a toast after its duration', () => {
    vi.useFakeTimers()

    useToast.getState().showToast({ title: 'Saved', duration: 1000 })
    render(<Toast />)

    expect(screen.getByText('Saved')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(useToast.getState().toasts).toEqual([])
  })
})
