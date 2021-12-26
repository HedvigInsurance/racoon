import classNames from 'classnames'
import React from 'react'

export const InputField = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={classNames(
        'text-center text-gray-900 text-lg uppercase',
        'border border-gray-500',
        'py-4 px-6 w-full rounded-lg',
        'focus:outline-none focus:border-gray-900',
        className,
      )}
      {...props}
    />
  )
}
