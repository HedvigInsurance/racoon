export type Insurance = {
  id: string
  name: string
  description: string
  img: {
    src: string
    alt?: string
    blurDataURL?: string
    objectPosition?: string
  }
  fieldName: string
  isPreselected?: boolean
  slug?: string
}

export type Insurances = Array<Insurance>
