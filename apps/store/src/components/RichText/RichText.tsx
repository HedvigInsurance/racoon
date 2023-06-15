import styled from '@emotion/styled'
import { richTextStyles } from '@/components/RichText/RichText.styles'

type RichTextProps = {
  contentHTML: string
  largeText?: boolean
}

export const RichText = ({ contentHTML, largeText }: RichTextProps) => {
  return <Content dangerouslySetInnerHTML={{ __html: contentHTML }} data-large-text={largeText} />
}

const Content = styled.div(richTextStyles)
