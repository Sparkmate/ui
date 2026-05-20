import * as React from 'react'

import { cn } from '../lib/utils'

export type ReleaseBadgeProps = React.ComponentProps<'span'> & {
  label: string
  version?: string
}

export function ReleaseBadge({
  label,
  version,
  className,
  ...props
}: ReleaseBadgeProps) {
  return (
    <span className={cn('app-release-badge', className)} {...props}>
      {version ? `${label} v${version}` : label}
    </span>
  )
}
