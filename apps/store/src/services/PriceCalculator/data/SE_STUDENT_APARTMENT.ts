import {
  apartmentSubTypeField,
  LAYOUT,
  ssnSeSection,
  yourApartmentSection,
  yourFamilySection,
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_STUDENT_APARTMENT: Template = {
  name: 'SE_STUDENT_APARTMENT',
  sections: [
    ssnSeSection,
    {
      ...yourApartmentSection,
      items: [
        {
          field: apartmentSubTypeField,
          layout: LAYOUT.FULL_WIDTH,
        },
        ...yourApartmentSection.items,
      ],
    },
    yourFamilySection,
  ],
}
