import { SbBlokData, storyblokEditable } from '@storyblok/react'
import { Perils } from '@/components/Perils/Perils'
import { PRODUCTS } from '@/services/mockProductService'

export const PerilsBlock = (blok: SbBlokData) => {
  return <Perils {...storyblokEditable(blok)} product={PRODUCTS[1]} />
}

PerilsBlock.blockName = 'perils'
