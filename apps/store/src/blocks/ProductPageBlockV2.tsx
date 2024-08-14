'use client'
import type { SbBlokData } from '@storyblok/react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import { notFound } from 'next/navigation'
import { type PurchaseFormProps } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { Features } from '@/utils/Features'

export type ProductPageBlockProps = SbBaseBlockProps<
  {
    body: Array<SbBlokData>
  } & Pick<PurchaseFormProps, 'showAverageRating'>
>

export const ProductPageBlockV2 = ({ blok }: ProductPageBlockProps) => {
  if (!Features.enabled('PRODUCT_PAGE_V2')) {
    throw notFound()
  }

  return (
    <main {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </main>
  )
}
