import styled from '@emotion/styled'
import { type PropsWithChildren } from 'react'
import { richTextStyles } from '@/components/RichText/RichText.styles'

type RichTextProps = PropsWithChildren<{ largeText?: boolean }>

export const RichText = ({ largeText, ...rest }: RichTextProps) => {
  return <Content data-large-text={largeText} {...rest} />
}

const Content = styled.div(richTextStyles)
