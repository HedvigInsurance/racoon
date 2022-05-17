export type Insurance = {
  id: string
  name: string
  description: string
  img: string
  fieldName: string
  isPreselected?: boolean
  isAdditionalCoverage?: boolean
  slug?: string
}

export type Insurances = Array<Insurance>
