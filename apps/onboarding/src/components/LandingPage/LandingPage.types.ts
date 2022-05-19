import { ImageProps } from 'next/image'

export type Insurance = {
  id: string
  name: string
  description: string
  img: ImageProps
  fieldName: string
  isPreselected?: boolean
  isAdditionalCoverage?: boolean
  slug?: string
}

export type Insurances = Array<Insurance>
