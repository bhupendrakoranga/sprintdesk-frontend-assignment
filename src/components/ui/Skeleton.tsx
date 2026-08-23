import type { SkeletonProps } from "../../types/global";

export default function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`} aria-label="Loading" role="status">
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} className="h-4 rounded bg-slate-200 dark:bg-slate-800" />
      ))}
    </div>
  )
}
