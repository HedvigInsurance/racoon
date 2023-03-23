import { Flags } from '@/services/Flags/Flags'

const petPages = new Set([
  'se/forsakringar/hundforsakring',
  'se/forsakringar/kattforsakring',
  'se/forsakringar/djurforsakring',
  'en-se/insurances/dog-insurance',
  'en-se/insurances/cat-insurance',
  'en-se/insurances/pet-insurance',
])
export const isDisabledPetLink = (slug: string) => {
  return petPages.has(trimSlashes(slug)) && !Flags.getFeature('PET_INSURANCE')
}

const trimSlashes = (url: string) => url.replaceAll(/(^\/|\/$)/g, '')
