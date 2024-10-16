'use client'

import clsx from 'clsx'
import { forwardRef, type ReactNode, type ForwardedRef } from 'react'
import type { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../TypeUtils'
import {
  baseButton,
  buttonVariant,
  centered,
  childrenWrapper,
  fullWidthStyles,
  textWrapper,
} from './Button.css'
import type { ButtonSize } from './Button.helpers'
import { getButtonSizeStyles } from './Button.helpers'
import { DotPulse } from './DotPulse'

type BaseProps = {
  variant?:
    | 'primary'
    | 'primary-alt'
    | 'secondary'
    | 'secondary-alt'
    | 'ghost'
    | 'ghost-alt'
    | 'outline'
  size?: ButtonSize
  fullWidth?: boolean
  hiddenText?: ReactNode
  loading?: boolean
  Icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  BaseProps
>

type PolymorphicComponent = <C extends React.ElementType = 'button'>(
  props: ButtonProps<C>,
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
    hiddenText,
    loading,
    disabled,
    target,
    rel,
    children,
    Icon,
    iconPosition = 'left',
    ...props
  }: ButtonProps<C>,
  ref?: ForwardedRef<PolymorphicRef<C>>,
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
      target={target}
      ref={ref}
      {...props}
    >
      <span className={childrenWrapper} style={{ opacity: loading ? 0 : 1 }}>
        {iconPosition === 'left' && Icon}
        {children && <span className={textWrapper}>{children}</span>}
        {iconPosition === 'right' && Icon}
      </span>
      {hiddenText && hiddenText}
      {loading && (
        <span className={centered}>
          <DotPulse />
        </span>
      )}
    </Component>
  )
})
