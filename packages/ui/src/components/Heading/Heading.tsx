import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import React from 'react'
import { getMargins, Margins } from '../../lib/margins'
import { UIColors } from '../../lib/theme/colors/colors'
import { getColor } from '../../lib/theme/theme'
import { getHeadingVariantStyles, HeadingVariant } from './Heading.helpers'
export type { PossibleHeadingVariant } from './Heading.helpers'

type HeadingColors = Pick<UIColors, 'textPrimary' | 'textSecondary' | 'textNegative'>

export type HeadingProps = Margins & {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: keyof HeadingColors
  children: React.ReactNode
  variant?: HeadingVariant
  align?: 'center' | 'left' | 'right'
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

type HeadingBaseProps = Pick<HeadingProps, 'color' | 'variant' | 'align'> & Margins

const HeadingBase = styled(
  'h2',
  elementConfig,
)<HeadingBaseProps>(({ theme, color, variant, align, ...props }) => {
  // GOTCHA: We may get empty string from Storyblok, this should be handled safely
  variant = variant || 'standard.32'
  return {
    color: color ? getColor(color) : 'currentColor',
    fontFamily: theme.fonts.heading,
    fontWeight: 400,
    lineHeight: 1.2,
    textAlign: align ?? 'left',
    ...getMargins(props),
    ...getHeadingVariantStyles(variant),
  }
})

export const Heading = ({ as, color, children, variant, align, ...rest }: HeadingProps) => {
  return (
    <HeadingBase as={as} color={color} variant={variant} align={align} {...rest}>
      {children}
    </HeadingBase>
  )
}
