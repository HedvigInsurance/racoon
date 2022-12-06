import {
  personalNumberSection,
  yourApartmentSection,
  yourFamilySection,
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_APARTMENT: Template = {
  name: 'SE_APARTMENT',
  sections: [personalNumberSection, yourApartmentSection, yourFamilySection],
}
