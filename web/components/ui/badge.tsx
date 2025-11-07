'use client'

import * as React from 'react'

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ')
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const variantClassName: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
  outline: 'text-foreground'
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantClassName[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }





