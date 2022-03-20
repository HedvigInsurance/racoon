import styled, { StyledComponent } from '@emotion/styled'

import React from 'react'
import { mq } from '../../lib/media-query'

export type BodyTextProps = {
  variant: 0 | 1 | 2 | 3
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
  colorVariant: 'dark' | 'medium' | 'light'
  children: React.ReactNode
}

type ColorProp = Pick<BodyTextProps, 'colorVariant'>

type StyleProps = {
  as: BodyTextProps['headingLevel']
} & ColorProp

const TextBase = styled.span<ColorProp>(({ theme, colorVariant }) => ({
  color:
    colorVariant === 'light'
      ? theme.colors.gray100
      : colorVariant === 'medium'
      ? theme.colors.gray700
      : theme.colors.gray900,
  margin: 0,
  padding: 0,
  fontFamily: theme.fonts.body,
  fontWeight: 400,
  letterSpacing: '-0.02em',
}))

const Body0 = styled(TextBase)<StyleProps>(() => ({
  fontSize: '1.125rem',
  lineHeight: '1.625rem',
  [mq.md]: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
}))

const Body1 = styled(TextBase)<StyleProps>(() => ({
  fontSize: '1rem',
  lineHeight: '1.5rem',
  [mq.md]: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
  },
}))

const Body2 = styled(TextBase)<StyleProps>(() => ({
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  [mq.md]: {
    fontSize: '1.125rem',
    lineHeight: '1.625rem',
  },
}))

const Body3 = styled(TextBase)<StyleProps>(() => ({
  fontSize: '0.75rem',
  lineHeight: '1rem',
  [mq.md]: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}))

type BodyTexts = Record<BodyTextProps['variant'], StyledComponent<{}, StyleProps, any>>

const textLevels: BodyTexts = {
  0: Body0,
  1: Body1,
  2: Body2,
  3: Body3,
}

export const BodyText = ({
  variant,
  headingLevel = 'span',
  colorVariant,
  children,
}: BodyTextProps) => {
  const TextComponent = textLevels[variant]

  return (
    <TextComponent as={headingLevel} colorVariant={colorVariant}>
      {children}
    </TextComponent>
  )
}
