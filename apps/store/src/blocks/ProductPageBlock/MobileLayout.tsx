import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { StoryblokComponent } from '@storyblok/react'
import { useState, useCallback, useRef } from 'react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import { ProductPageBlockProps } from './ProductPageBlock'
import { PageSection } from './ProductPageBlock.types'
import {
  StickyHeader,
  Content,
  OverviewSection,
  VariantSelector,
  triggerListStyles,
  triggerStyles,
} from './ProductPageBlockBase'

export const MobileLayout = ({ blok }: ProductPageBlockProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const { productData } = useProductPageContext()
  const [activeSection, setActiveSection] = useState<PageSection>('overview')

  const handleTabClick = useCallback((value: string) => {
    setActiveSection(value as PageSection)
    contentRef.current?.scrollIntoView()
  }, [])

  const shouldRenderVariantSelector =
    activeSection === 'coverage' && productData.variants.length > 1

  return (
    <>
      <PurchaseForm />
      <Content ref={contentRef}>
        <RadixTabs.Tabs value={activeSection} onValueChange={handleTabClick}>
          <StickyHeader>
            <RadixTabs.TabsList>
              <TablistWrapper>
                <TabTrigger value="overview">{blok.overviewLabel}</TabTrigger>
                <TabTrigger value="coverage">{blok.coverageLabel}</TabTrigger>
              </TablistWrapper>
              {shouldRenderVariantSelector && <VariantSelector />}
            </RadixTabs.TabsList>
          </StickyHeader>

          <OverviewSection>
            <RadixTabs.TabsContent value="overview">
              {blok.overview?.map((nestedBlock) => (
                <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
              ))}
            </RadixTabs.TabsContent>
          </OverviewSection>

          <RadixTabs.TabsContent value="coverage">
            {blok.coverage?.map((nestedBlock) => (
              <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
            ))}
          </RadixTabs.TabsContent>
        </RadixTabs.Tabs>
      </Content>
    </>
  )
}

const TablistWrapper = styled.div(triggerListStyles)

const TabTrigger = styled(RadixTabs.Trigger)(triggerStyles)
