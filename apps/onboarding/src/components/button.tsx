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
        'hover:-translate-y-[2px] hover:shadow-md focus:-translate-y-[2px] focus:shadow-md',
      )}
    />
  )
}
