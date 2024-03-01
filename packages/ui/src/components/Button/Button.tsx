'use client'

import clsx from 'clsx'
import { ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { buttonVariant, centered, childrenWrapper, fullWidthStyles } from './Button.css'
import { ButtonSize, getButtonSizeStyles } from './Button.helpers'
import { DotPulse } from './DotPulse'

type LinkProps = {
  href?: string
  target?: string
  rel?: string
}

type CustomButtonProps = {
  variant?: 'primary' | 'primary-alt' | 'secondary' | 'secondary-alt' | 'ghost'
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  Icon?: ReactNode
} & LinkProps

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & CustomButtonProps

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    variant = 'primary',
    size = 'large',
    fullWidth,
    loading,
    children,
    target,
    title,
    rel,
    ...baseProps
  } = props

  const buttonChildren = (
    <>
      <span className={childrenWrapper} style={{ opacity: loading ? 0 : 1 }}>
        {props.Icon} {children}
      </span>
      {loading && (
        <span className={centered}>
          <DotPulse />
        </span>
      )}
    </>
  )

  const buttonProps = {
    ...baseProps,
    children: buttonChildren,
    as: props.href ? 'a' : 'button',
    ref,
    disabled: props.disabled || loading,
    ...(loading && { 'data-loading': true }),
    ...(target === '_blank' && { target: '_blank', rel: 'noopener' }),
    ...(rel ? { rel: rel } : {}),
    ...(title ? { title: title } : {}),
  } as const
  const sizeStyles = getButtonSizeStyles(size)
  const classNames = clsx(buttonVariant[variant], sizeStyles, fullWidth && fullWidthStyles)

  return <button className={classNames} {...buttonProps} />
})

Button.displayName = 'Button'
