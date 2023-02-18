import styled from '@emotion/styled'
import { StoryblokComponent } from '@storyblok/react'
import { useRef, useEffect, useState } from 'react'
import { theme } from 'ui'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import { ProductPageBlockProps } from './ProductPageBlock'
import { PageSection } from './ProductPageBlock.types'
import {
  AnimatedHeader,
  Content,
  OverviewSection,
  StyledProductVariantSelector,
  triggerListStyles,
  triggerStyles,
} from './ProductPageBlockBase'

export const DesktopLayout = ({ blok }: ProductPageBlockProps) => {
  const { productData } = useProductPageContext()
  const [activeSection, setActiveSection] = useState<PageSection>('overview')

  useActiveSectionChangeListener(['overview', 'coverage'], (sectionId) =>
    setActiveSection(sectionId as PageSection),
  )

  const shouldRenderVariantSelector =
    activeSection === 'coverage' && productData.variants.length > 1

  return (
    <>
      <AnimatedHeader>
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
          {shouldRenderVariantSelector && <StyledProductVariantSelector />}
        </nav>
      </AnimatedHeader>
      <Grid>
        <Content>
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
  )
}

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  alignItems: 'flex-start',
})

const ContentNavigationList = styled.ol(triggerListStyles)

const ContentNavigationTrigger = styled.a(triggerStyles)

const PurchaseFormWrapper = styled.div({
  position: 'sticky',
  top: '9vh',
  // Scroll independently if content is too long
  maxHeight: '100vh',
  overflow: 'auto',
  paddingBottom: theme.space.xl,
})

const useActiveSectionChangeListener = (
  sectionsId: Array<string>,
  callback: (activeSectionId: string) => void,
) => {
  // Used to determine if user is scrolling up
  const scrollPositionRef = useRef(0)

  useEffect(() => {
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
  }, [sectionsId, callback])
}
