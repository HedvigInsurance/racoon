'use client'
import styled from '@emotion/styled'
import type { SbBlokData } from '@storyblok/react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import { motion, useScroll } from 'framer-motion'
import type { ReactNode } from 'react'
import { startTransition } from 'react'
import { useCallback, useState, useEffect, useRef } from 'react'
import { theme, mq } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { MAX_WIDTH } from '@/components/GridLayout/GridLayout.constants'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.css'
import {
  PurchaseForm,
  type PurchaseFormProps,
} from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useIdleCallback } from '@/utils/useIdleCallback'
import { zIndexes } from '@/utils/zIndex'

export const NAVIGATION_LIST_HEIGHT = '2.5rem'
const SCROLL_PERCENTAGE_THRESHOLD = 10 // 10%

export type PageSection = 'overview' | 'coverage'

export type ProductPageBlockProps = SbBaseBlockProps<
  {
    overviewLabel: string
    coverageLabel: string
    overview: Array<SbBlokData>
    coverage: Array<SbBlokData>
    body: Array<SbBlokData>
  } & Pick<PurchaseFormProps, 'showAverageRating'>
>

export const ProductPageBlock = ({ blok }: ProductPageBlockProps) => {
  const [activeSection, setActiveSection] = useState<PageSection>('overview')

  useActiveSectionChangeListener(['overview', 'coverage'], (sectionId) =>
    setActiveSection(sectionId as PageSection),
  )

  return (
    <main {...storyblokEditable(blok)}>
      <StickyHeader>
        <nav aria-label="page content">
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
        </nav>
      </StickyHeader>

      <Grid>
        <GridLayout.Content width="1/2" align="right">
          <PurchaseFormWrapper>
            <PurchaseForm showAverageRating={blok.showAverageRating} />
          </PurchaseFormWrapper>
        </GridLayout.Content>

        <OverviewGridArea width="1/2" align="left">
          <section id="overview">
            {blok.overview.map((nestedBlock) => (
              <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
            ))}
          </section>
        </OverviewGridArea>

        <GridLayout.Content width="1" align="center">
          <CoverageSection blocks={blok.coverage} />
        </GridLayout.Content>
      </Grid>

      <ContentSection blocks={blok.body} />
    </main>
  )
}

const StickyHeader = ({ children }: { children: ReactNode }) => {
  const { scrollY } = useScroll()
  const [matchesScrollThreshold, setMatchesScrollThreshold] = useState(false)

  useEffect(() => {
    scrollY.on('change', (currentScrollY) => {
      const scrollPercentage = Math.round(
        (currentScrollY / document.documentElement.scrollHeight) * 100,
      )
      setMatchesScrollThreshold(scrollPercentage > SCROLL_PERCENTAGE_THRESHOLD)
    })
  }, [scrollY])

  return (
    <StyledStickyHeader
      variants={{
        hidden: { opacity: 0, transitionEnd: { display: 'none' } },
        visible: { opacity: 1, display: 'revert' },
      }}
      initial="hidden"
      animate={matchesScrollThreshold ? 'visible' : 'hidden'}
    >
      {children}
    </StyledStickyHeader>
  )
}

const StyledStickyHeader = styled(motion.header)({
  position: 'sticky',
  top: theme.space.sm,
  zIndex: zIndexes.tabs,
  paddingInline: theme.space.md,
  maxWidth: MAX_WIDTH,
  marginInline: 'auto',

  [mq.md]: {
    paddingInline: theme.space.lg,
  },
  [mq.lg]: {
    top: theme.space.md,
  },
})

const ContentNavigationList = styled.ol({
  display: 'flex',
  gap: theme.space.xs,
  height: NAVIGATION_LIST_HEIGHT,
})

const ContentNavigationTrigger = styled.a({
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
  boxShadow: theme.shadow.default,
  backdropFilter: 'blur(20px)',
  borderRadius: theme.radius.sm,

  '&[data-state=active]': {
    paddingInline: theme.space.xxxl,
    color: theme.colors.dark,
    backgroundColor: theme.colors.grayTranslucent300,
  },

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.gray200,
      transition: `background-color ${theme.transitions.hover}`,

      '&[data-state=active]': {
        backgroundColor: theme.colors.grayTranslucent400,
      },
    },
  },

  '&:focus-visible': {
    boxShadow: theme.shadow.focus,
  },
})

const Grid = styled(GridLayout.Root)({
  // TODO: Ideally padding that are currently spcing content from the edge of the page
  // should be added by the container.
  paddingInline: 0,

  [mq.lg]: {
    paddingInline: 0,
  },
})

const OverviewGridArea = styled(GridLayout.Content)({
  // Even though Overview section comes right after PurchaseForm in the DOM order,
  // it should be "displayed" before PurchaseForm for desktop layout.
  [mq.lg]: {
    gridRow: 1,
  },
})

const PurchaseFormWrapper = styled.div({
  paddingTop: '3vw',

  [mq.lg]: {
    position: 'sticky',
    top: HEADER_HEIGHT_DESKTOP,
    // Scroll independently if content is too long
    maxHeight: `calc(100vh - ${HEADER_HEIGHT_DESKTOP})`,
    overflow: 'auto',
    paddingBottom: theme.space.xl,
    paddingTop: '6vw',
  },
})

const useActiveSectionChangeListener = (
  sectionsId: Array<string>,
  callback: (activeSectionId: string) => void,
) => {
  // Used to determine if user is scrolling up
  const scrollPositionRef = useRef(0)

  useEffect(() => {
    const instersectionObserverCb = (entries: Array<IntersectionObserverEntry>) => {
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
  }, [sectionsId, callback])
}

// Optimization:
// Perils list could be hundreds of DOM elements (400+ for Apartment rent) and if we lazy-render it, page load time of product pages improves
const CoverageSection = (props: { blocks: Array<SbBlokData> }) => {
  const shouldRenderContent = useRenderLazily()
  return (
    <section id="coverage">
      {shouldRenderContent &&
        props.blocks.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
    </section>
  )
}

// Optimization
// Lazy rendering, same as CoverageSection above
const ContentSection = (props: { blocks: Array<SbBlokData> }) => {
  const shouldRenderContent = useRenderLazily()
  return (
    <>
      {shouldRenderContent &&
        props.blocks.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
    </>
  )
}

const useRenderLazily = () => {
  const [shouldRender, setShouldRender] = useState(false)
  // Callback need to be stable to avoid rerender loop
  const makeVisible = useCallback(() => startTransition(() => setShouldRender(true)), [])
  useIdleCallback(makeVisible)
  return shouldRender
}
