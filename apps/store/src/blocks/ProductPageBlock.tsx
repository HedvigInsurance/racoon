import styled from '@emotion/styled'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { useState } from 'react'
import { mq } from 'ui'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import * as Tabs from '@/components/ProductPage/Tabs'
import { ProductVariantSelector } from '@/components/ProductVariantSelector/ProductVariantSelector'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductPageBlockProps = SbBaseBlockProps<{
  overviewLabel: string
  coverageLabel: string
  overview: SbBlokData[]
  coverage: SbBlokData[]
  body: SbBlokData[]
}>

export const ProductPageBlock = ({ blok }: ProductPageBlockProps) => {
  const { productData } = useProductPageContext()
  const [selectedTab, setSelectedTab] = useState('overview')

  const shouldRenderVariantSelector = selectedTab === 'coverage' && productData.variants.length > 1

  return (
    <Main {...storyblokEditable(blok)}>
      <MobileLayout>
        <PurchaseForm />
        <Tabs.Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <Tabs.TabsList>
            <TablistWrapper>
              <Tabs.TabsTrigger value="overview">{blok.overviewLabel}</Tabs.TabsTrigger>
              <Tabs.TabsTrigger value="coverage">{blok.coverageLabel}</Tabs.TabsTrigger>
            </TablistWrapper>
            {shouldRenderVariantSelector && <StyledProductVariantSelector />}
          </Tabs.TabsList>

          <OverviewSectionMobile>
            <Tabs.TabsContent value="overview">
              {blok.overview?.map((nestedBlock) => (
                <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
              ))}
            </Tabs.TabsContent>
          </OverviewSectionMobile>

          <Tabs.TabsContent value="coverage">
            {blok.coverage?.map((nestedBlock) => (
              <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
            ))}
          </Tabs.TabsContent>
        </Tabs.Tabs>
      </MobileLayout>

      <DesktopLayout>
        <>
          <ProductUpper>
            <div>
              {blok.overview?.map((nestedBlock) => (
                <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
              ))}
            </div>

            <PurchaseFormWrapper>
              <PurchaseForm />
            </PurchaseFormWrapper>
          </ProductUpper>

          {blok.coverage?.map((nestedBlock) => (
            <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
          ))}
        </>
      </DesktopLayout>

      {blok.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </Main>
  )
}

ProductPageBlock.blockName = 'product'

const Main = styled.main({
  width: '100%',
})

const ProductUpper = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  alignItems: 'flex-start',
})

const PurchaseFormWrapper = styled.div({
  position: 'sticky',
  top: 0,
  // Scroll independently if content is too long
  maxHeight: '100vh',
  overflow: 'auto',
})

const OverviewSectionMobile = styled.div(({ theme }) => ({
  marginTop: `-${theme.space[7]}`,
}))

const MobileLayout = styled.div({
  [mq.lg]: {
    display: 'none',
  },
})

const DesktopLayout = styled.div({
  display: 'none',
  [mq.lg]: {
    display: 'block',
  },
})

const StyledProductVariantSelector = styled(ProductVariantSelector)({
  minWidth: '12.5rem',
  width: 'fit-content',
})

const TablistWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  gap: theme.space[2],
}))
