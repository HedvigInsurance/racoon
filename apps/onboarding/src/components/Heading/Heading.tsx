import styled, { StyledComponent } from '@emotion/styled'
import React from 'react'
import { mq, theme } from 'ui'

export type HeadingProps = {
  variant: 'xl' | 'l' | 'm' | 's' | 'xs' | 'overline'
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  colorVariant: 'dark' | 'light'
  children: React.ReactNode
}

type ColorProp = Pick<HeadingProps, 'colorVariant'>

type StyleProps = {
  as: HeadingProps['headingLevel']
} & ColorProp

const HeadingBase = styled.span<ColorProp>(({ colorVariant }) => ({
  color: colorVariant === 'light' ? theme.colors.gray100 : theme.colors.gray900,
  margin: 0,
  padding: 0,
  fontFamily: theme.fonts.body,
  fontWeight: 400,
}))

const HeadingXL = styled(HeadingBase)<StyleProps>(() => ({
  fontSize: '3.5rem',
  lineHeight: '4rem',
  letterSpacing: '-0.02em',
  [mq.md]: {
    fontSize: '4.5rem',
    lineHeight: '4.5rem',
  },
}))

const HeadingL = styled(HeadingBase)<StyleProps>(() => ({
  fontSize: '2.5rem',
  lineHeight: '2.75rem',
  letterSpacing: '-0.02em',
  [mq.md]: {
    fontSize: '3.5rem',
    lineHeight: '4rem',
  },
}))

const HeadingM = styled(HeadingBase)<StyleProps>(() => ({
  fontSize: '2rem',
  lineHeight: '2.5rem',
  letterSpacing: '-0.02em',
  [mq.md]: {
    fontSize: '3rem',
    lineHeight: '3.5rem',
  },
}))

const HeadingS = styled(HeadingBase)<StyleProps>(() => ({
  fontSize: '1.5rem',
  lineHeight: '2rem',
  letterSpacing: '-0.02em',
  [mq.md]: {
    fontSize: '2rem',
    lineHeight: '2.5rem',
  },
}))

const HeadingXS = styled(HeadingBase)<StyleProps>(() => ({
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  letterSpacing: '-0.02em',
  [mq.md]: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
}))

const HeadingOverline = styled(HeadingBase)<StyleProps>(() => ({
  textTransform: 'uppercase',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  letterSpacing: '0',
  [mq.md]: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
}))

type Headings = Record<
  HeadingProps['variant'],
  StyledComponent<Record<string, unknown>, StyleProps, any>
>

const headings: Headings = {
  xl: HeadingXL,
  l: HeadingL,
  m: HeadingM,
  s: HeadingS,
  xs: HeadingXS,
  overline: HeadingOverline,
}

export const Heading = ({ variant, headingLevel, colorVariant, children }: HeadingProps) => {
  const HeadingComponent = headings[variant]

  return (
    <HeadingComponent as={headingLevel} colorVariant={colorVariant}>
      {children}
    </HeadingComponent>
  )
}
