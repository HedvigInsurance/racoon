import {
  ssnSeSection,
  yourApartmentSection,
  yourFamilySection,
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_APARTMENT_RENT: Template = {
  name: 'SE_APARTMENT_RENT',
  sections: [ssnSeSection, yourApartmentSection, yourFamilySection],
}
