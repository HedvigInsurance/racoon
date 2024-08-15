'use client'
import type { SbBlokData } from '@storyblok/react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import { notFound } from 'next/navigation'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { type PurchaseFormProps } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { Features } from '@/utils/Features'
import { wrapper } from './ProductPageBlockV2.css'

export type ProductPageBlockProps = SbBaseBlockProps<
  {
    body: Array<SbBlokData>
    topSectionFirstColumn: Array<SbBlokData>
    topSectionSecondColumn: Array<SbBlokData>
  } & Pick<PurchaseFormProps, 'showAverageRating'>
>

export const ProductPageBlockV2 = ({ blok }: ProductPageBlockProps) => {
  if (!Features.enabled('PRODUCT_PAGE_V2')) {
    throw notFound()
  }

  return (
    <main className={wrapper} {...storyblokEditable(blok)}>
      <GridLayout.Root>
        <GridLayout.Content width={{ lg: '1/2' }} align="left">
          {blok.topSectionFirstColumn.map((nestedBlock) => (
            <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
          ))}
        </GridLayout.Content>
        <GridLayout.Content width={{ lg: '1/2' }} align="right">
          {blok.topSectionSecondColumn.map((nestedBlock) => (
            <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
          ))}
        </GridLayout.Content>
      </GridLayout.Root>

      {blok.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </main>
  )
}
