'use client'

import clsx from 'clsx'
import {
  ButtonHTMLAttributes,
  forwardRef,
  type ForwardedRef,
  type LegacyRef,
  type ReactNode,
} from 'react'
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

export type Props = ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> & CustomButtonProps
type Ref = HTMLButtonElement | HTMLAnchorElement

export const Button = forwardRef<Ref, Props>((props, ref) => {
  const {
    className,
    variant = 'primary',
    size = 'large',
    fullWidth,
    loading,
    href,
    children,
    target,
    title,
    rel,
    Icon,
    ...baseProps
  } = props

  const buttonChildren = (
    <>
      <span className={childrenWrapper} style={{ opacity: loading ? 0 : 1 }}>
        {Icon} {children}
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
    disabled: props.disabled || loading,
    ...(loading && { 'data-loading': true }),
    ...(target === '_blank' && { target: '_blank', rel: 'noopener' }),
    ...(rel ? { rel: rel } : {}),
    ...(title ? { title: title } : {}),
  } as const
  const sizeStyles = getButtonSizeStyles(size)
  const classNames = clsx(
    buttonVariant[variant],
    sizeStyles,
    fullWidth && fullWidthStyles,
    className,
  )

  if (href) {
    return (
      <a
        className={classNames}
        href={href}
        ref={ref as LegacyRef<HTMLAnchorElement>}
        {...buttonProps}
      />
    )
  }

  return (
    <button className={classNames} ref={ref as ForwardedRef<HTMLButtonElement>} {...buttonProps} />
  )
})

Button.displayName = 'Button'
