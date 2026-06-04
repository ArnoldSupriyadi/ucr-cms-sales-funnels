import * as React from 'react'
import { cn } from '@/lib/utils'

function Alert({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & { variant?: 'default' | 'destructive' }) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7',
        variant === 'destructive'
          ? 'border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600'
          : 'border-slate-200 bg-slate-50 text-slate-800 [&>svg]:text-slate-600',
        className
      )}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mb-0.5 font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-sm leading-relaxed', className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription }
