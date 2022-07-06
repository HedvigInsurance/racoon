import { SE_APARTMENT_TEMPLATE } from './data/SE_APARTMENT'
import { SE_CAR_TEMPLATE } from './data/SE_CAR'
import { FormTemplate } from './FormTemplate.types'

const TEMPLATE = { SE_APARTMENT: SE_APARTMENT_TEMPLATE, SE_CAR: SE_CAR_TEMPLATE } as const

type FetchParams = {
  id: string
}

export class FormTemplateService {
  public async fetch({ id }: FetchParams): Promise<FormTemplate | null> {
    return TEMPLATE[id as unknown as keyof typeof TEMPLATE]
  }
}
