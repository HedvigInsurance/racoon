import { Features } from '@/utils/Features'

const petPages = new Set([
  'se/forsakringar/hundforsakring',
  'se/forsakringar/kattforsakring',
  'se/forsakringar/djurforsakring',
  'se-en/insurances/dog-insurance',
  'se-en/insurances/cat-insurance',
  'se-en/insurances/pet-insurance',
])
export const isDisabledPetLink = (slug: string) => {
  return petPages.has(trimSlashes(slug)) && !Features.enabled('PET_INSURANCE')
}

const trimSlashes = (url: string) => url.replaceAll(/(^\/|\/$)/g, '')
