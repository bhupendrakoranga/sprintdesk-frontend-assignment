import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  error?: ReactNode
  helperText?: ReactNode
  containerClassName?: string
  labelClassName?: string
}

const inputBaseClassName =
  'block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 sm:text-sm/6'

export default function InputField({
  id,
  label,
  error,
  helperText,
  containerClassName,
  labelClassName,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...inputProps
}: InputFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  const describedBy = [ariaDescribedBy, error ? errorId : helperText ? helperId : undefined]
    .filter(Boolean)
    .join(' ') || undefined

  const inputClassName = [
    inputBaseClassName,
    error
      ? 'border-red-500 focus:border-red-600 focus:ring-red-600'
      : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-600',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className={labelClassName ?? 'block text-sm/6 font-medium text-gray-900 dark:text-slate-100'}>
          {label}
        </label>
      )}

      <div className={label ? 'mt-2' : undefined}>
        <input
          {...inputProps}
          id={inputId}
          className={inputClassName}
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : (
        helperText && (
          <p id={helperId} className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )
      )}
    </div>
  )
}
