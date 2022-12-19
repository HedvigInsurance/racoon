import styled from '@emotion/styled'
import React from 'react'
import { getMargins, Margins } from '../../lib/margins'
import { getColor } from '../../lib/theme/theme'
import { getHeadingVariant, HeadingVariant } from './Heading.helpers'

export type HeadingProps = Margins & {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: 'dark' | 'light'
  children: React.ReactNode
  variant?: HeadingVariant | ''
  textAlignment?: 'left' | 'center'
}

type HeadingBaseProps = Pick<HeadingProps, 'color' | 'variant' | 'textAlignment'> & Margins

const HeadingBase = styled.h2<HeadingBaseProps>(
  ({ theme, color, variant, textAlignment, ...props }) => {
    // GOTCHA: We may get empty string from Storyblok, this should be handled safely
    variant = variant || 'standard.32'
    return {
      color: color ? getColor(color) : 'currentColor',
      fontFamily: theme.fonts.heading,
      fontWeight: 400,
      lineHeight: 1.2,
      textAlign: textAlignment ?? 'left',
      ...getMargins(props),
      ...getHeadingVariant(variant, theme),
    }
  },
)

export const Heading = ({ as, color, children, variant, textAlignment, ...rest }: HeadingProps) => {
  return (
    <HeadingBase as={as} color={color} variant={variant} textAlignment={textAlignment} {...rest}>
      {children}
    </HeadingBase>
  )
}
