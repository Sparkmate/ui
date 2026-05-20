import * as React from 'react'

import { cn } from '../lib/utils'

export type StatusState = 'online' | 'error' | 'disabled' | 'unknown'

export type StatusDotProps = React.ComponentProps<'span'> & {
  status: StatusState
}

const statusClassMap: Record<StatusState, string> = {
  online: 'bg-green-400',
  error: 'bg-red-500',
  disabled: 'bg-line',
  unknown: 'bg-muted',
}

export function StatusDot({ status, className, ...props }: StatusDotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'h-1.5 w-1.5 rounded-full flex-shrink-0',
        statusClassMap[status],
        className,
      )}
      {...props}
    />
  )
}

export type StatusRowProps = React.ComponentProps<'div'> & {
  status: StatusState
  label: React.ReactNode
  value?: React.ReactNode
}

export function StatusRow({
  status,
  label,
  value,
  className,
  ...props
}: StatusRowProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <StatusDot status={status} />
      <span className="serial text-body truncate">{label}</span>
      {value ? <span className="ml-auto text-xs text-muted">{value}</span> : null}
    </div>
  )
}
