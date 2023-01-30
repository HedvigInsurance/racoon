import { ssnSeSection, yourApartmentSection, yourFamilySection } from '../formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_APARTMENT_BRF: Template = {
  name: 'SE_APARTMENT_BRF',
  sections: [ssnSeSection, yourApartmentSection, yourFamilySection],
}
