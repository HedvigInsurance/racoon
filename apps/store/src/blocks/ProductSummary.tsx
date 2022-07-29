import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { ProductSummary } from '@/components/ProductPage/ProductSummary/ProductSummary'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = {
  title: string
  description: string
  starScore: number
  gradient: readonly [string, string]
}

type ProductSummaryBlockProps = SbBaseBlockProps<Props>

export const ProductSummaryBlock = (props: ProductSummaryBlockProps) => {
  return (
    <Wrapper {...storyblokEditable}>
      <ProductSummary {...props.blok}>{props.blok.description}</ProductSummary>
    </Wrapper>
  )
}

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))
