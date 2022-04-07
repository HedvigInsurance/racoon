export type Insurance = {
  id: string
  name: string
  description: string
  img: string
  embarkStoreKey: string
  isPreselected?: boolean
  isAdditionalCoverage?: boolean
}

export type Insurances = Array<Insurance>
