import styled from '@emotion/styled'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { useBreakpoint } from 'ui'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import * as Tabs from '@/components/ProductPage/Tabs'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductPageBlockProps = SbBaseBlockProps<{
  overviewLabel: string
  coverageLabel: string
  overview: SbBlokData[]
  coverage: SbBlokData[]
  body: SbBlokData[]
}>

export const ProductPageBlock = ({ blok }: ProductPageBlockProps) => {
  const isDesktop = useBreakpoint('lg')
  return (
    <Main {...storyblokEditable(blok)}>
      {!isDesktop && (
        <>
          <PurchaseForm />
          <Tabs.Tabs defaultValue="overview">
            <Tabs.TabsList>
              <Tabs.TabsTrigger value="overview">{blok.overviewLabel}</Tabs.TabsTrigger>
              <Tabs.TabsTrigger value="coverage">{blok.coverageLabel}</Tabs.TabsTrigger>
            </Tabs.TabsList>

            <Tabs.TabsContent value="overview">
              {blok.overview?.map((nestedBlock) => (
                <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
              ))}
            </Tabs.TabsContent>

            <Tabs.TabsContent value="coverage">
              {blok.coverage?.map((nestedBlock) => (
                <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
              ))}
            </Tabs.TabsContent>
          </Tabs.Tabs>
        </>
      )}

      {isDesktop && (
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
      )}

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
})
