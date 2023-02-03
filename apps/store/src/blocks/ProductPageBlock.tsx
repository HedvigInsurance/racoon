import styled, { CSSObject } from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import Head from 'next/head'
import { useState } from 'react'
import { mq, theme } from 'ui'
import { MENU_BAR_HEIGHT_MOBILE, MENU_BAR_HEIGHT_DESKTOP } from '@/components/Header/HeaderStyles'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import * as Tabs from '@/components/ProductPage/Tabs'
import { ProductVariantSelector } from '@/components/ProductVariantSelector/ProductVariantSelector'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { zIndexes } from '@/utils/zIndex'

const TABLIST_HEIGHT = '2.5rem'

type PageSection = 'overview' | 'coverage'

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
  const [activeSection, setActiveSection] = useState<PageSection>('overview')

  const shouldRenderVariantSelector =
    activeSection === 'coverage' && productData.variants.length > 1

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
          <Content>
            <RadixTabs.Tabs
              value={activeSection}
              onValueChange={(value) => {
                setActiveSection(value as PageSection)
                window?.scrollTo({ top: 0 })
              }}
            >
              <TabList>
                <TabTrigger value="overview">{blok.overviewLabel}</TabTrigger>
                <TabTrigger value="coverage">{blok.coverageLabel}</TabTrigger>
                {shouldRenderVariantSelector && <StyledProductVariantSelector />}
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
            </RadixTabs.Tabs>
          </Content>
        </MobileLayout>

        <DesktopLayout>
          <>
            <Grid>
              <Content>
                <ContentNavigation aria-label="page content">
                  <ContentNavigationList>
                    <li>
                      <ContentNavigationTrigger
                        href="#overview"
                        onClick={() => setActiveSection('overview')}
                        data-state={activeSection === 'overview' ? 'active' : 'inactive'}
                      >
                        {blok.overviewLabel}
                      </ContentNavigationTrigger>
                    </li>
                    <li>
                      <ContentNavigationTrigger
                        href="#coverage"
                        onClick={() => setActiveSection('coverage')}
                        data-state={activeSection === 'coverage' ? 'active' : 'inactive'}
                      >
                        {blok.coverageLabel}
                      </ContentNavigationTrigger>
                    </li>
                  </ContentNavigationList>
                </ContentNavigation>
                <OverviewSection>
                  <PageContentSentinel id="overview" aria-hidden="true" />
                  {blok.overview?.map((nestedBlock) => (
                    <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
                  ))}
                </OverviewSection>
              </Content>
              <PurchaseFormWrapper>
                <PurchaseForm />
              </PurchaseFormWrapper>
            </Grid>

            <PageContentSentinel id="coverage" aria-hidden="true" />
            {blok.coverage?.map((nestedBlock) => (
              <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
            ))}
          </>
        </DesktopLayout>

        {blok.body.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
      </Main>
    </>
  )
}
ProductPageBlock.blockName = 'product'

const sharedListStyles: CSSObject = {
  display: 'flex',
  gap: theme.space.xs,
  height: TABLIST_HEIGHT,
  paddingInline: theme.space.md,
}

const sharedStickyStyles: CSSObject = {
  position: 'sticky',
  top: `calc(${theme.space.sm} + ${MENU_BAR_HEIGHT_MOBILE})`,
  zIndex: zIndexes.tabs,

  [mq.md]: {
    top: `calc(${theme.space.sm} + ${MENU_BAR_HEIGHT_DESKTOP})`,
    paddingInline: theme.space.lg,
  },
  [mq.lg]: {
    top: `calc(${theme.space.md} + ${MENU_BAR_HEIGHT_DESKTOP})`,
    paddingInline: theme.space.xl,
  },
}

const sharedTriggerStyles: CSSObject = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  textAlign: 'center',
  paddingInline: theme.space.md,
  paddingBlock: theme.space.xs,
  fontSize: theme.fontSizes.md,
  lineHeight: theme.fontSizes.xl,
  color: theme.colors.dark,
  backgroundColor: theme.colors.grayTranslucent100,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.radius.sm,

  '&[data-state=active]': {
    paddingInline: theme.space.xxxl,
    color: theme.colors.dark,
    backgroundColor: theme.colors.grayTranslucent400,
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.purple500}`,
  },
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
    display: 'block',
  },
})

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  alignItems: 'flex-start',
})

const Content = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  isolation: 'isolate',
})

const TabList = styled(RadixTabs.TabsList)({
  ...sharedListStyles,
  ...sharedStickyStyles,
})

const TabTrigger = styled(RadixTabs.Trigger)({
  ...sharedTriggerStyles,
})

const ContentNavigation = styled.nav({
  ...sharedStickyStyles,
})

const ContentNavigationList = styled.ul({
  ...sharedListStyles,
})

const ContentNavigationTrigger = styled.a({
  ...sharedTriggerStyles,
})

const PageContentSentinel = styled.div({
  '::before': {
    content: '""',
    display: 'block',
    // Workaround: Add some 'padding top' that matches menu bar height while scrolling
    // until an element gets into viewport. Another alternative would be to
    // use 'scroll-padding-top' property. However that would required thouching global styles
    // that are defined into 'package/ui': html { scroll-padding-top: <menu-height> }
    height: MENU_BAR_HEIGHT_MOBILE,
    marginTop: `-${MENU_BAR_HEIGHT_MOBILE}`,

    [mq.md]: {
      height: MENU_BAR_HEIGHT_DESKTOP,
      marginTop: `-${MENU_BAR_HEIGHT_DESKTOP}`,
    },
  },
})

const StyledProductVariantSelector = styled(ProductVariantSelector)({
  minWidth: '12.5rem',
  width: 'fit-content',
})
