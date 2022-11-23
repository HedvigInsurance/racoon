import styled from '@emotion/styled'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import * as Tabs from '@/components/ProductPage/Tabs'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductPageBlockProps = SbBaseBlockProps<{
  overview: SbBlokData[]
  coverage: SbBlokData[]
  body: SbBlokData[]
}>

export const ProductPageBlock = ({ blok }: ProductPageBlockProps) => {
  return (
    <Main {...storyblokEditable(blok)}>
      <PurchaseForm />

      <Tabs.Tabs defaultValue="overview">
        <Tabs.TabsList>
          {/* TODO: Get tab labels from Storyblok */}
          <Tabs.TabsTrigger value="overview">Overview</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="coverage">Coverage</Tabs.TabsTrigger>
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
