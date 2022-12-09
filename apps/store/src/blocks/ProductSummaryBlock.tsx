import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { ProductSummary } from '@/components/ProductPage/ProductSummary/ProductSummary'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type ProductSummaryBlockContext = {
  title: string
}

type Props = SbBaseBlockProps<{
  title?: string
  description: string
}>

export const ProductSummaryBlock = (props: Props) => {
  const { story } = useProductPageContext()
  const blockTitle = props.blok.title || story.content.name

  return (
    <Wrapper {...storyblokEditable}>
      <ProductSummary title={blockTitle}>{props.blok.description}</ProductSummary>
    </Wrapper>
  )
}
ProductSummaryBlock.blockName = 'productSummary'

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))
