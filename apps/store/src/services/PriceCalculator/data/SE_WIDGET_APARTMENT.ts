import {
  LAYOUT,
  ssnSeSection,
  studentField,
  yourApartmentSection,
  yourFamilySection,
} from '../formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_WIDGET_APARTMENT: Template = {
  name: 'SE_WIDGET_APARTMENT',
  sections: [
    ssnSeSection,
    {
      ...yourApartmentSection,
      items: [
        ...yourApartmentSection.items,
        {
          field: studentField,
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
    },
    yourFamilySection,
  ],
}
