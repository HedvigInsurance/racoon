import { ssnSeSection, yourApartmentSection, yourFamilySection } from '../formFragments'
import type { Template } from '../PriceCalculator.types'

export const SE_APARTMENT_RENT: Template = {
  name: 'SE_APARTMENT_RENT',
  sections: [ssnSeSection, yourApartmentSection, yourFamilySection],
}
