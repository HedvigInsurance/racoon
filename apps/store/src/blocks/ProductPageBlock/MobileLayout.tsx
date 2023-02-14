import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { StoryblokComponent } from '@storyblok/react'
import { useState } from 'react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import * as Tabs from '@/components/ProductPage/Tabs'
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

export const MobileLayout = ({ blok }: ProductPageBlockProps) => {
  const { productData } = useProductPageContext()
  const [activeSection, setActiveSection] = useState<PageSection>('overview')

  const shouldRenderVariantSelector =
    activeSection === 'coverage' && productData.variants.length > 1

  return (
    <>
      <PurchaseForm />
      <Content>
        <RadixTabs.Tabs
          value={activeSection}
          onValueChange={(value) => {
            setActiveSection(value as PageSection)
            window?.scrollTo({ top: 0 })
          }}
        >
          <AnimatedHeader>
            <RadixTabs.TabsList>
              <TablistWrapper>
                <TabTrigger value="overview">{blok.overviewLabel}</TabTrigger>
                <TabTrigger value="coverage">{blok.coverageLabel}</TabTrigger>
              </TablistWrapper>
              {shouldRenderVariantSelector && <StyledProductVariantSelector />}
            </RadixTabs.TabsList>
          </AnimatedHeader>

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
    </>
  )
}

const TablistWrapper = styled.div(triggerListStyles)

const TabTrigger = styled(RadixTabs.Trigger)(triggerStyles)
