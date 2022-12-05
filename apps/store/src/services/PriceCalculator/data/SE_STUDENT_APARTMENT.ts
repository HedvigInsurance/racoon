import {
  personalNumberSection,
  yourApartmentSection,
  yourFamilySection,
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_STUDENT_APARTMENT: Template = {
  name: 'SE_STUDENT_APARTMENT',
  initialData: {
    isStudent: true,
  },
  sections: [personalNumberSection, yourApartmentSection, yourFamilySection],
}
