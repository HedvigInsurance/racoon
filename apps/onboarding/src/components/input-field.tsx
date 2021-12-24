import classNames from 'classnames'
import React from 'react'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string
}

export const InputField = ({ className, errorMessage, ...props }: InputFieldProps) => {
  const hasError = errorMessage !== undefined

  return (
    <div className="space-y-1">
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
        {...props}
      />

      <div className="text-center">
        <span
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
