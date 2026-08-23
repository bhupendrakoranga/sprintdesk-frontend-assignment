import type { ReactNode, SelectHTMLAttributes } from 'react'

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode
  options: SelectOption[]
  error?: ReactNode
  helperText?: ReactNode
  containerClassName?: string
}

export default function Select({
  id,
  label,
  options,
  error,
  helperText,
  containerClassName,
  className,
  ...selectProps
}: SelectProps) {
  const errorId = id ? `${id}-error` : undefined
  const helperId = id ? `${id}-helper` : undefined

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-900 dark:text-slate-100">
          {label}
        </label>
      )}
      <select
        {...selectProps}
        id={id}
        className={`mt-2 block w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 dark:bg-slate-900 dark:text-slate-100 ${
          error
            ? 'border-red-500 focus:border-red-600 focus:ring-red-600'
            : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 dark:border-slate-700'
        } ${className ?? ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
