import styled from '@emotion/styled'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import Head from 'next/head'
import { useState } from 'react'
import { mq, theme } from 'ui'
import { MENU_BAR_HEIGHT_DESKTOP } from '@/components/Header/HeaderStyles'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import * as Tabs from '@/components/ProductPage/Tabs'
import type { TabsProps } from '@/components/ProductPage/Tabs'
import { ProductVariantSelector } from '@/components/ProductVariantSelector/ProductVariantSelector'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

const TABLIST_HEIGHT = '2.5rem'

type SEOData = {
  robots: 'index' | 'noindex'
  seoMetaTitle?: string
  seoMetaDescription?: string
  seoMetaOgImage?: StoryblokAsset
}

type ProductPageBlockProps = SbBaseBlockProps<
  {
    overviewLabel: string
    coverageLabel: string
    overview: SbBlokData[]
    coverage: SbBlokData[]
    body: SbBlokData[]
  } & SEOData
>

export const ProductPageBlock = ({ blok }: ProductPageBlockProps) => {
  const { productData } = useProductPageContext()
  const [selectedTab, setSelectedTab] = useState('overview')

  const shouldRenderVariantSelector = selectedTab === 'coverage' && productData.variants.length > 1

  return (
    <>
      <Head>
        <meta name="robots" content={blok.robots} />
        {blok.seoMetaTitle && (
          <>
            <meta name="title" content={blok.seoMetaTitle} />
            <meta property="og:title" content={blok.seoMetaTitle} />
          </>
        )}
        {blok.seoMetaDescription && (
          <>
            <meta name="description" content={blok.seoMetaDescription} />
            <meta property="og:description" content={blok.seoMetaDescription} />
          </>
        )}
        {blok.seoMetaOgImage && <meta property="og:image" content={blok.seoMetaOgImage.filename} />}
      </Head>
      <Main {...storyblokEditable(blok)}>
        <MobileLayout>
          <PurchaseForm />
          <ProducPageTabs
            blok={blok}
            renderVariantSelector={shouldRenderVariantSelector}
            value={selectedTab}
            onValueChange={setSelectedTab}
          />
        </MobileLayout>

        <DesktopLayout>
          <ProducPageTabs
            blok={blok}
            renderVariantSelector={shouldRenderVariantSelector}
            value={selectedTab}
            onValueChange={setSelectedTab}
          />

          <PurchaseFormWrapper>
            <PurchaseForm />
          </PurchaseFormWrapper>
        </DesktopLayout>

        {blok.body.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
      </Main>
    </>
  )
}
ProductPageBlock.blockName = 'product'

type ProductPageTabsProps = {
  blok: ProductPageBlockProps['blok']
  renderVariantSelector?: boolean
} & Pick<TabsProps, 'value' | 'onValueChange'>

const ProducPageTabs = ({ blok, renderVariantSelector, ...delegated }: ProductPageTabsProps) => {
  const handleValueChange = (value: string) => {
    delegated.onValueChange?.(value)
    window?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Tabs.Tabs {...delegated} onValueChange={handleValueChange}>
      <TabList>
        <TablistWrapper>
          <Tabs.TabsTrigger value="overview">{blok.overviewLabel}</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="coverage">{blok.coverageLabel}</Tabs.TabsTrigger>
        </TablistWrapper>
        {renderVariantSelector && <StyledProductVariantSelector />}
      </TabList>

      <OverviewSection>
        <Tabs.TabsContent value="overview">
          {blok.overview?.map((nestedBlock) => (
            <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
          ))}
        </Tabs.TabsContent>
      </OverviewSection>

      <Tabs.TabsContent value="coverage">
        {blok.coverage?.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
      </Tabs.TabsContent>
    </Tabs.Tabs>
  )
}

const Main = styled.main({
  width: '100%',
})

const PurchaseFormWrapper = styled.div({
  position: 'sticky',
  top: '9vh',
  // Scroll independently if content is too long
  maxHeight: '100vh',
  overflow: 'auto',
  paddingBottom: theme.space.xl,
})

const OverviewSection = styled.div({
  marginTop: `calc(-${TABLIST_HEIGHT} - ${theme.space.xs})`,
  [mq.md]: {
    marginTop: `calc(-${TABLIST_HEIGHT} - ${theme.space.md})`,
  },
  [mq.lg]: {
    marginTop: `-${TABLIST_HEIGHT}`,
  },
})

const MobileLayout = styled.div({
  [mq.lg]: {
    display: 'none',
  },
})

const DesktopLayout = styled.div({
  display: 'none',
  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    alignItems: 'flex-start',
  },
})

const StyledProductVariantSelector = styled(ProductVariantSelector)({
  minWidth: '12.5rem',
  width: 'fit-content',
})

const TabList = styled(Tabs.TabsList)({
  [mq.md]: {
    top: `calc(${theme.space.sm} + ${MENU_BAR_HEIGHT_DESKTOP})`,
    paddingInline: theme.space.lg,
  },
  [mq.lg]: {
    top: `calc(${theme.space.md} + ${MENU_BAR_HEIGHT_DESKTOP})`,
    paddingInline: theme.space.xl,
  },
})

const TablistWrapper = styled.div({
  display: 'flex',
  gap: theme.space.xs,
  height: TABLIST_HEIGHT,
})
