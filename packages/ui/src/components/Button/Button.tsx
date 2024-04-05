'use client'

import clsx from 'clsx'
import { forwardRef, type ReactNode } from 'react'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../TypeUtils'
import { buttonVariant, centered, childrenWrapper, fullWidthStyles } from './Button.css'
import { ButtonSize, getButtonSizeStyles } from './Button.helpers'
import { DotPulse } from './DotPulse'

type BaseProps = {
  variant?: 'primary' | 'primary-alt' | 'secondary' | 'secondary-alt' | 'ghost'
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  Icon?: ReactNode
}

type Props<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, BaseProps>

export const Button = forwardRef(
  <C extends React.ElementType = 'button'>(props: Props<C>, ref?: PolymorphicRef<C>) => {
    const {
      as,
      className,
      variant = 'primary',
      size = 'large',
      fullWidth,
      loading,
      children,
      target,
      disabled,
      rel,
      Icon,
      ...baseProps
    } = props

    const buttonProps = {
      ...baseProps,
      ...(target === '_blank' && { target: '_blank', rel: 'noopener' }),
    } as const

    const sizeStyles = getButtonSizeStyles(size)

    const classNames = clsx(
      buttonVariant[variant],
      sizeStyles,
      fullWidth && fullWidthStyles,
      className,
    )

    const Component = as ?? 'button'

    const isDisabled = disabled || loading
    const componentRel = target === '_blank' ? 'noopener' : rel

    return (
      <Component
        className={classNames}
        {...buttonProps}
        data-loading={loading}
        disabled={isDisabled}
        rel={componentRel}
        ref={ref}
      >
        <span className={childrenWrapper} style={{ opacity: loading ? 0 : 1 }}>
          {Icon} {children}
        </span>
        {loading && (
          <span className={centered}>
            <DotPulse />
          </span>
        )}
      </Component>
    )
  },
)

export type ButtonProps = React.ComponentPropsWithRef<typeof Button>

Button.displayName = 'Button'
