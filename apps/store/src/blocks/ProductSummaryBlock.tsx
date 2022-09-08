import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { ProductSummary } from '@/components/ProductPage/ProductSummary/ProductSummary'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

const PLACEHOLDER_GRADIENT = ['#00BFFF', '#00ff00'] as const

export type ProductSummaryBlockContext = {
  title: string
  gradient: readonly [string, string]
}

type Props = SbBaseBlockProps<{
  title?: string
  description: string
  starScore: number
}>

export const ProductSummaryBlock = (props: Props) => {
  const { story } = useProductPageContext()
  const blockTitle = props.blok.title || story.content.name

  return (
    <Wrapper {...storyblokEditable}>
      <ProductSummary
        title={blockTitle}
        starScore={props.blok.starScore}
        gradient={PLACEHOLDER_GRADIENT}
      >
        {props.blok.description}
      </ProductSummary>
    </Wrapper>
  )
}
ProductSummaryBlock.blockName = 'productSummary'

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))
