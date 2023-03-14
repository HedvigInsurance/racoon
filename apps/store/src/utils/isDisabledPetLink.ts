import { Flags } from '@/services/Flags/Flags'

const petPages = new Set([
  'se/forsakringar/djurforsakring/hundforsakring',
  'se/forsakringar/djurforsakring/kattforsakring',
  'en-se/insurances/pet-insurance/dog-insurance',
  'en-se/insurances/pet-insurance/cat-insurance',
])
export const isDisabledPetLink = (slug: string) => {
  return petPages.has(trimSlashes(slug)) && !Flags.getFeature('PET_INSURANCE')
}

const trimSlashes = (url: string) => url.replaceAll(/(^\/|\/$)/g, '')
