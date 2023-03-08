import styled from '@emotion/styled'
import { useScroll } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { ConditionalWrapper, Space, Text, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductVariantSelector } from '@/components/ProductVariantSelector/ProductVariantSelector'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { zIndexes } from '@/utils/zIndex'

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
        <VariantSelector />
        {blok.content && <StyledText size={{ _: 'xl', lg: 'xxl' }}>{blok.content}</StyledText>}
      </Space>
    </ConditionalWrapper>
  )
}

const VariantSelector = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollY } = useScroll()

  const [reachedTopScreen, setReachedTopScreen] = useState(false)
  useEffect(() => {
    if (!ref.current) return

    const initialElementOffsetTop = ref.current.offsetTop
    // TODO: derivate this from ProductPageBlock's navigation links height
    const offset = 64

    scrollY.on('change', (currentScrollY) => {
      if (ref.current) {
        setReachedTopScreen(currentScrollY >= initialElementOffsetTop - offset)
      }
    })
  }, [scrollY])

  return (
    <VariantSelectorWrapper ref={ref} data-fixed={reachedTopScreen ? 'true' : 'false'}>
      <StyledProductVariantSelector />
    </VariantSelectorWrapper>
  )
}

const VariantSelectorWrapper = styled.div({
  width: 'fit-content',
  minWidth: '12.5rem',

  ['&[data-fixed=true]']: {
    position: 'fixed',
    top: 64,
    zIndex: zIndexes.tabs,
  },
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
