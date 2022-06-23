import styled from '@emotion/styled'
import { ReactNode } from 'react'

type FontSize = 's' | 'm' | 'l' | 'xl'

type TypographyProps = {
  size: FontSize
  children: ReactNode
}

const fontSizes: Record<FontSize, string> = {
  s: '0.875rem',
  m: '1rem',
  l: '1.125rem',
  xl: '1.25rem',
}

const TextElement = styled.span(({ size }: TypographyProps) => ({
  fontSize: fontSizes[size],
}))

export const Text = ({ size = 'm', children }: TypographyProps) => {
  return <TextElement size={size}>{children}</TextElement>
}
