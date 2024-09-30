'use client'

import { clsx } from 'clsx'
import type { UIColors, Level } from '../../theme'
import { sprinkles } from '../../theme/sprinkles.css'
import type { PolymorphicComponentsProps } from '../TypeUtils'
import { balanceTextStyles, responsiveVariantStyles } from './Heading.css'

type StandardHeadingSize = '16' | '18' | '20' | '24' | '32' | '40' | '48' | '56' | '72' | '96'
type SerifHeadingSize = Exclude<StandardHeadingSize, '16' | '18'>
export type PossibleHeadingVariant = `standard.${StandardHeadingSize}` | `serif.${SerifHeadingSize}`

type HeadingColors = Pick<
  UIColors,
  | 'textPrimary'
  | 'textSecondary'
  | 'textNegative'
  | 'textTranslucentPrimary'
  | 'textTranslucentSecondary'
  | 'textTranslucentTertiary'
>

export type HeadingProps = PolymorphicComponentsProps<
  'h1' | 'h2' | 'h3' | 'h4' | 'p',
  {
    color?: keyof HeadingColors
    variant?: PossibleHeadingVariant | Partial<Record<Level | '_', PossibleHeadingVariant>>
    align?: 'center' | 'left' | 'right'
    balance?: boolean
  }
>

export function Heading({
  as,
  className,
  color = 'textPrimary',
  variant = 'standard.32',
  align = 'left',
  balance,
  children,
  ...rest
}: HeadingProps) {
  const Component = as ?? 'h2'

  return (
    <Component
      className={clsx(
        responsiveVariantStyles(variant),
        sprinkles({ color, textAlign: align }),
        balance && balanceTextStyles,
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}
