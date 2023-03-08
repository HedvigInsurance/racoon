import styled from '@emotion/styled'
import { ConditionalWrapper, Space, Text, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductVariantSelector } from '@/components/ProductVariantSelector/ProductVariantSelector'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductVariantSelectorBlockProps = SbBaseBlockProps<{
  content?: string
}>

export const ProductVariantSelectorBlock = ({ blok, nested }: ProductVariantSelectorBlockProps) => {
  return (
    <ConditionalWrapper
      condition={!nested}
      wrapWith={(children) => (
        <GridLayout.Root>
          <GridLayout.Content width="1/2" align="left">
            {children}
          </GridLayout.Content>
        </GridLayout.Root>
      )}
    >
      <Space y={1}>
        <VariantSelectorWrapper>
          <StyledProductVariantSelector />
        </VariantSelectorWrapper>
        {blok.content && <StyledText size={{ _: 'xl', lg: 'xxl' }}>{blok.content}</StyledText>}
      </Space>
    </ConditionalWrapper>
  )
}

const VariantSelectorWrapper = styled.div({
  width: 'fit-content',
  minWidth: '12.5rem',
})

const StyledProductVariantSelector = styled(ProductVariantSelector)({
  backgroundColor: theme.colors.greenFill1,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',

  ':hover, :focus-within': {
    backgroundColor: theme.colors.greenFill3,
  },
})

const StyledText = styled(Text)({
  maxWidth: '37.5rem', // 600px
})

ProductVariantSelectorBlock.blockName = 'productVariantSelector'
