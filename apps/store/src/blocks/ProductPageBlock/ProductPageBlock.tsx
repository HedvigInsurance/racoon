import type { SbBlokData } from '@storyblok/react'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import {
  PurchaseForm,
  type PurchaseFormProps,
} from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { gridOverview, gridRoot, purchaseFormWrapper } from './ProductPageBlock.css'
import { ContentSection, CoverageSection } from './Sections'

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
  return (
    <main {...storyblokEditable(blok)}>
      <GridLayout.Root className={gridRoot}>
        <GridLayout.Content width="1/2" align="right">
          <div className={purchaseFormWrapper}>
            <PurchaseForm showAverageRating={blok.showAverageRating} />
          </div>
        </GridLayout.Content>

        <GridLayout.Content width="1/2" align="left" className={gridOverview}>
          <section id="overview">
            {blok.overview.map((nestedBlock) => (
              <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
            ))}
          </section>
        </GridLayout.Content>

        <GridLayout.Content width="1" align="center">
          <CoverageSection blocks={blok.coverage} />
        </GridLayout.Content>
      </GridLayout.Root>

      <ContentSection blocks={blok.body} />
    </main>
  )
}
