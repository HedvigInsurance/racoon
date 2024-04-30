'use client'

import clsx from 'clsx'
import { forwardRef, type ReactNode } from 'react'
import type { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../TypeUtils'
import { baseButton, buttonVariant, centered, childrenWrapper, fullWidthStyles } from './Button.css'
import type { ButtonSize } from './Button.helpers'
import { getButtonSizeStyles } from './Button.helpers'
import { DotPulse } from './DotPulse'

type BaseProps = {
  variant?: 'primary' | 'primary-alt' | 'secondary' | 'secondary-alt' | 'ghost' | 'ghost-alt'
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  Icon?: ReactNode
}

export type Props<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, BaseProps>

type PolymorphicComponent = <C extends React.ElementType = 'button'>(
  props: Props<C>,
) => ReactNode | null

export const Button: PolymorphicComponent = forwardRef(function Button<
  C extends React.ElementType = 'button',
>(
  {
    as,
    variant = 'primary',
    size = 'large',
    className,
    fullWidth,
    loading,
    disabled,
    target,
    rel,
    children,
    Icon,
    ...props
  }: Props<C>,
  ref?: PolymorphicRef<C>,
) {
  const sizeStyles = getButtonSizeStyles(size)

  const classNames = clsx(
    baseButton,
    buttonVariant[variant],
    sizeStyles,
    fullWidth && fullWidthStyles,
    className,
  )

  const Component = as ?? 'button'

  const isDisabled = disabled || loading
  const shouldSetDefaultRel = !rel && target === '_blank'
  const componentRel = shouldSetDefaultRel ? 'noopener' : rel

  return (
    <Component
      className={classNames}
      data-loading={loading}
      disabled={isDisabled}
      rel={componentRel}
      ref={ref}
      {...props}
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
})
