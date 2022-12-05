import {
  personalNumberSection,
  yourApartmentSection,
  yourFamilySection,
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_APARTMENT_RENT: Template = {
  name: 'SE_APARTMENT_RENT',
  initialData: { subType: 'RENT' },
  sections: [personalNumberSection, yourApartmentSection, yourFamilySection],
}
