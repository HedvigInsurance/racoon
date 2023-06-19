import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { richTextStyles } from '@/components/RichText/RichText.styles'

type RichTextProps = {
  children: ReactNode
  contentHTML?: string
  largeText?: boolean
}

export const RichText = ({ largeText, children }: RichTextProps) => {
  return <Content data-large-text={largeText}>{children}</Content>
}

const Content = styled.div(richTextStyles)
