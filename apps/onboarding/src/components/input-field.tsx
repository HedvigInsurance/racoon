import React from 'react'
import { WarningIcon } from './warnning-icon'
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
            'text-center text-gray-900 text-lg uppercase',
            'border border-gray-500',
            'py-4 px-6 w-full rounded-lg',
            'focus:outline-none',
            {
              'focus:border-gray-900': !hasError,
              'border-red-500': hasError,
            },
            className,
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorMessageId : undefined}
          {...props}
        />

        {hasError && <WarningIcon className="text-red-500 w-4 h-4 absolute right-5" />}
      </div>

      <div className="text-center">
        <span
          id={errorMessageId}
          aria-hidden={!hasError}
          className={classNames('text-red-500', 'text-xs', {
            'text-opacity-0': !hasError,
          })}
        >
          {errorMessage || 'PLACEHOLDER'}
        </span>
      </div>
    </div>
  )
}
