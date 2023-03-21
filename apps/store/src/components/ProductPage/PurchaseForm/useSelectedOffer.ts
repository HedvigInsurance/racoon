import { atom, useAtom } from 'jotai'
import { ProductOfferFragment } from '@/services/apollo/generated'

const selectedOfferAtom = atom<ProductOfferFragment | null>(null)

export const useSelectedOffer = () => {
  return useAtom(selectedOfferAtom)
}
