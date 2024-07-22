'use client'
import type { SbBlokData } from '@storyblok/react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import { type PurchaseFormProps } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type ProductPageBlockProps = SbBaseBlockProps<
  {
    body: Array<SbBlokData>
  } & Pick<PurchaseFormProps, 'showAverageRating'>
>

export const ProductPageBlockV2 = ({ blok }: ProductPageBlockProps) => {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </main>
  )
}
