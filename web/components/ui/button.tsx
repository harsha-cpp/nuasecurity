'use client'

import * as React from 'react'

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ')
}

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

const variantClassName: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground shadow hover:opacity-90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline'
}

const sizeClassName: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3',
  lg: 'h-10 rounded-md px-8',
  icon: 'h-9 w-9'
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          variantClassName[variant],
          sizeClassName[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'



