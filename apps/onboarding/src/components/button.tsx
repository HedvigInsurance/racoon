import classNames from 'classnames'
import React from 'react'

export const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={classNames(
        className,
        'bg-purple-500 text-gray-900 rounded-lg py-4 px-6 w-full max-w-sm',
        'transition-all duration-150 ease-in-out',
        {
          'bg-gray-300': props.disabled,
          'cursor-not-allowed': props.disabled,
        },
        {
          'hover:-translate-y-[2px] focus:-translate-y-[2px]': !props.disabled,
          'hover:shadow-md focus:shadow-md': !props.disabled,
        },
      )}
    />
  )
}
