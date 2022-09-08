import styled from '@emotion/styled'
import { ReactNode } from 'react'

type FontSize = 's' | 'm' | 'l' | 'xl'

type TypographyProps = {
  size: FontSize
  children: ReactNode
}

const fontSizeMap = { s: 1, m: 2, l: 3, xl: 4 }

const TextElement = styled.span<TypographyProps>(({ theme, size }) => ({
  fontSize: theme.fontSizes[fontSizeMap[size]],
}))

export const Text = ({ size = 'm', children }: TypographyProps) => {
  return <TextElement size={size}>{children}</TextElement>
}
