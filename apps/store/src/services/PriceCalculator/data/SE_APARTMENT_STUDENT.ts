import {
  apartmentSubTypeField,
  LAYOUT,
  ssnSeSection,
  yourApartmentSection,
  yourFamilySection,
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_APARTMENT_STUDENT: Template = {
  name: 'SE_APARTMENT_STUDENT',
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
