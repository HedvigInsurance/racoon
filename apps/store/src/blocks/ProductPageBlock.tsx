import { Global } from '@emotion/react'
import styled, { CSSObject } from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import Head from 'next/head'
import { useRef, useState, useEffect } from 'react'
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

  useActiveSectionChangeListener(['overview', 'coverage'], (sectionId) =>
    setActiveSection(sectionId as PageSection),
  )

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
      <Global
        styles={{
          html: {
            [mq.md]: {
              scrollPaddingTop: MENU_BAR_HEIGHT_DESKTOP,
            },
          },
        }}
      />
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
                        data-state={activeSection === 'overview' ? 'active' : 'inactive'}
                        aria-current={activeSection === 'overview' ? 'true' : undefined}
                      >
                        {blok.overviewLabel}
                      </ContentNavigationTrigger>
                    </li>
                    <li>
                      <ContentNavigationTrigger
                        href="#coverage"
                        data-state={activeSection === 'coverage' ? 'active' : 'inactive'}
                        aria-current={activeSection === 'coverage' ? 'true' : undefined}
                      >
                        {blok.coverageLabel}
                      </ContentNavigationTrigger>
                    </li>
                  </ContentNavigationList>
                </ContentNavigation>
                <OverviewSection id="overview">
                  {blok.overview?.map((nestedBlock) => (
                    <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
                  ))}
                </OverviewSection>
              </Content>
              <PurchaseFormWrapper>
                <PurchaseForm />
              </PurchaseFormWrapper>
            </Grid>

            <section id="coverage">
              {blok.coverage?.map((nestedBlock) => (
                <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
              ))}
            </section>
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

const OverviewSection = styled.section({
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

const ContentNavigationList = styled.ol({
  ...sharedListStyles,
})

const ContentNavigationTrigger = styled.a({
  ...sharedTriggerStyles,
})

const StyledProductVariantSelector = styled(ProductVariantSelector)({
  minWidth: '12.5rem',
  width: 'fit-content',
})

function useActiveSectionChangeListener(
  sectionsId: Array<string>,
  callback: (activeSectionId: string) => void,
) {
  // Used to determine if user is scrolling up
  const scrollPositionRef = useRef(0)

  useEffect(
    function identifyActiveSection() {
      const instersectionObserverCb = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          const diff = scrollPositionRef.current - window.scrollY
          const isScrollingUp = diff > 0

          if (isScrollingUp) {
            if (!entry.isIntersecting) {
              const activeSectionIndex = sectionsId.findIndex((sectionId) => sectionId === id)
              const previousSectionId = sectionsId[activeSectionIndex - 1]
              if (previousSectionId) {
                callback(previousSectionId)
                scrollPositionRef.current = window.scrollY
              }
            }
          } else {
            if (entry.isIntersecting) {
              callback(id)
              scrollPositionRef.current = window.scrollY
            }
          }
        })
      }

      const observer = new IntersectionObserver(instersectionObserverCb, {
        // Observe only the top 15% of the screen
        rootMargin: '0% 0% -85% 0%',
      })
      sectionsId.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
          observer.observe(element)
        }
      })

      return () => observer.disconnect()
    },
    [sectionsId, callback],
  )
}
