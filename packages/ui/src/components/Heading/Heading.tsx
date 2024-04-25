'use client'

import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import React from 'react'
import Balancer from 'react-wrap-balancer'
import type { Margins, UIColors } from '../../theme'
import { getColor, getMargins, theme } from '../../theme'
import type { HeadingVariant } from './Heading.helpers'
import { getHeadingVariantStyles } from './Heading.helpers'

export type { PossibleHeadingVariant } from './Heading.helpers'

type HeadingColors = Pick<
  UIColors,
  | 'textPrimary'
  | 'textSecondary'
  | 'textNegative'
  | 'textTranslucentPrimary'
  | 'textTranslucentSecondary'
  | 'textTranslucentTertiary'
>

export type HeadingProps = Margins & {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  color?: keyof HeadingColors
  children: React.ReactNode
  variant?: HeadingVariant
  align?: 'center' | 'left' | 'right'
  balance?: boolean
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

type HeadingBaseProps = Pick<HeadingProps, 'color' | 'variant' | 'align'> & Margins

const HeadingBase = styled(
  'h2',
  elementConfig,
)<HeadingBaseProps>(({ color, variant, align, ...props }) => {
  // GOTCHA: We may get empty string from Storyblok, this should be handled safely
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  variant = variant || 'standard.32'
  return {
    color: color ? getColor(color) : 'currentColor',
    fontFamily: theme.fonts.heading,
    fontWeight: 400,
    lineHeight: 1.2,
    textAlign: align ?? 'left',
    whiteSpace: 'pre-wrap',
    ...getMargins(props),
    ...getHeadingVariantStyles(variant),
  }
})

export const Heading = ({
  as,
  color,
  children,
  variant,
  align,
  balance,
  ...rest
}: HeadingProps) => (
  <HeadingBase as={as} color={color} variant={variant} align={align} {...rest}>
    {!balance ? children : <Balancer>{children}</Balancer>}
  </HeadingBase>
)
