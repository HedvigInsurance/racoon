export type Insurance = {
  id: string
  name: string
  description: string
  img: string
  blurDataURL: string
  fieldName: string
  isPreselected?: boolean
  isAdditionalCoverage?: boolean
}

export type Insurances = Array<Insurance>
