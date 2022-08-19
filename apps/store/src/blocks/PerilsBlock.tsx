import { SbBlokData, storyblokEditable } from '@storyblok/react'
import { Perils } from '@/components/Perils/Perils'
import { PRODUCTS } from '@/services/mockProductService'

export const PerilsBlock = (blok: SbBlokData) => {
  return <Perils {...storyblokEditable(blok)} perils={PRODUCTS[2].insurances[0].perils} />
}
