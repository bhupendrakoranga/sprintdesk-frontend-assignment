import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: ReactNode;
}

const baseClassName =
  "relative inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed";

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-indigo-600",
  secondary:
    "bg-gray-600 text-white shadow-xs hover:bg-gray-500 focus-visible:outline-gray-600",
  outline:
    "border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  danger:
    "bg-red-600 text-white shadow-xs hover:bg-red-500 focus-visible:outline-red-600",
};

const sizeClassNames: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-1.5 text-sm/6",
  md: "min-h-10 px-4 py-2 text-sm",
  lg: "min-h-11 px-5 py-2.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "sm",
  fullWidth = false,
  isLoading = false,
  loadingText = "Please wait",
  className,
  disabled,
  ...buttonProps
}: ButtonProps) {
  const buttonClassName = [
    baseClassName,
    variantClassNames[variant],
    sizeClassNames[size],
    fullWidth && "w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...buttonProps}
      className={buttonClassName}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
