import React from 'react'
import { WarningTriangleIcon } from './warning-triangle-icon'
import classNames from 'classnames'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string
}

export const InputField = ({ className, errorMessage, ...props }: InputFieldProps) => {
  const hasError = errorMessage !== undefined
  const errorMessageId = `${props.id}-error`

  return (
    <div className="space-y-1">
      <div className="relative flex items-center">
        <input
          className={classNames(
            'text-gray-900 text-lg uppercase',
            'border',
            'p-4 w-full rounded-lg',
            'placeholder:text-gray-500',
            'focus:outline-none',
            {
              'focus:border-gray-900 border-gray-300': !hasError,
              'border-red-500': hasError,
              'bg-gray-300 text-gray-500': props.disabled,
            },
            className,
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorMessageId : undefined}
          {...props}
        />
      </div>

      <div
        className={classNames('flex items-center space-x-1', {
          'opacity-0': !hasError,
        })}
      >
        <WarningTriangleIcon className="text-red-600 w-4 h-4" />
        <span
          id={errorMessageId}
          aria-hidden={!hasError}
          className={classNames('text-red-600', 'text-xs', {
            'text-opacity-0': !hasError,
          })}
        >
          {errorMessage || 'PLACEHOLDER'}
        </span>
      </div>
    </div>
  )
}
