import { Link, LinkProps } from 'remix'

import { LoadingDots } from './loading-dots'
import React from 'react'
import classNames from 'classnames'
import { useCurrentLocale } from '~/lib/l10n'

type ClassNameProps = { loading?: boolean; disabled?: boolean }

const getCommonClassName = ({ loading, disabled = false }: ClassNameProps) => {
  return classNames(
    'bg-purple-500 text-gray-900 rounded-lg py-4 px-6 w-full max-w-sm h-8',
    'transition-all duration-150 ease-in-out',
    {
      'bg-gray-300': disabled && !loading,
      'cursor-not-allowed': disabled && !loading,
      'hover:-translate-y-[2px] focus:-translate-y-[2px]': !disabled,
      'hover:shadow-md focus:shadow-md': !disabled,
    },
  )
}

type CommonProps = { loading?: boolean; className?: string }

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & CommonProps

export const Button = ({ className, children, loading, disabled, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={classNames(getCommonClassName({ loading, disabled }), className)}
    >
      {loading ? <LoadingDots /> : children}
    </button>
  )
}

type LinkButtonProps = React.PropsWithChildren<LinkProps> &
  CommonProps & {
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
  }

export const LinkButton = ({
  loading,
  className,
  children,
  onClick,
  ...props
}: LinkButtonProps) => {
  return (
    <Link {...props}>
      <a
        className={classNames(
          getCommonClassName({ loading }),
          'flex justify-center items-center',
          className,
        )}
        onClick={onClick}
      >
        {children}
      </a>
    </Link>
  )
}

type ExternalLinkProps = LinkButtonProps & {
  href: string
}

export const ExternalLinkButton = ({
  loading,
  className,
  children,
  href,
  ...props
}: ExternalLinkProps) => {
  const { path } = useCurrentLocale()

  return (
    <a
      {...props}
      href={`/${path.toLowerCase()}${href}`}
      className={classNames(
        getCommonClassName({ loading }),
        'flex justify-center items-center',
        className,
      )}
    >
      {children}
    </a>
  )
}
