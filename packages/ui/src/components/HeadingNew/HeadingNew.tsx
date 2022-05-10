import styled from '@emotion/styled'
import React from 'react'
import { getColor } from 'ui'
import { getMargins, Margins } from '../../lib/margins'
import { getHeadingVariant, HeadingVariant } from './HeadingNew.helpers'

export type HeadingProps = Margins & {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: 'dark' | 'light'
  children: React.ReactNode
  variant: HeadingVariant
}

type HeadingBaseProps = Pick<HeadingProps, 'color' | 'variant'> & Margins

const HeadingBase = styled.h2<HeadingBaseProps>(({ theme, color, variant, ...props }) => ({
  color: getColor(color),
  fontFamily: theme.fonts.heading,
  fontWeight: 400,
  lineHeight: 1.2,
  ...getMargins(props),
  ...getHeadingVariant(variant, theme),
}))

export const Heading = ({
  as,
  color,
  children,
  variant = 'standard.32',
  ...rest
}: HeadingProps) => {
  return (
    <HeadingBase as={as} color={color} variant={variant} {...rest}>
      {children}
    </HeadingBase>
  )
}
