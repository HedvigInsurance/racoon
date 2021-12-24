import classNames from 'classnames'
import React from 'react'
import { LoadingDots } from './loading-dots'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

export const Button = ({ className, loading, disabled, children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={classNames(
        className,
        'bg-purple-500 text-gray-900 rounded-lg py-4 px-6 w-full max-w-sm h-8',
        'transition-all duration-150 ease-in-out',
        {
          'bg-gray-300': disabled && !loading,
          'cursor-not-allowed': disabled && !loading,
          'hover:-translate-y-[2px] focus:-translate-y-[2px]': !disabled,
          'hover:shadow-md focus:shadow-md': !disabled,
        },
      )}
    >
      {loading ? <LoadingDots /> : children}
    </button>
  )
}
