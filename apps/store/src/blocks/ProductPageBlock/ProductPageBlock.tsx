import type { SbBlokData } from '@storyblok/react'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { ProductPageSectionNav } from '@/blocks/ProductPageBlock/ProductPageSectionNav'
import {
  PurchaseForm,
  type PurchaseFormProps,
} from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import {
  gridOverview,
  gridRoot,
  gridPurchaseForm,
  gridCoverage,
  purchaseFormWrapper,
} from './ProductPageBlock.css'
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
      <ProductPageSectionNav
        overviewLabel={blok.overviewLabel}
        coverageLabel={blok.coverageLabel}
      />

      <div className={gridRoot}>
        <div className={gridPurchaseForm}>
          <div className={purchaseFormWrapper}>
            <PurchaseForm showAverageRating={blok.showAverageRating} />
          </div>
        </div>

        <div className={gridOverview}>
          <section id="overview">
            {blok.overview.map((nestedBlock) => (
              <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
            ))}
          </section>
        </div>

        <div className={gridCoverage}>
          <CoverageSection blocks={blok.coverage} />
        </div>
      </div>

      <ContentSection blocks={blok.body} />
    </main>
  )
}
