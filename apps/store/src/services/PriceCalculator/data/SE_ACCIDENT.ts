import {
  LAYOUT,
  livingSpaceField,
  personalNumberSection,
  postalCodeField,
  streetAddressField,
  yourFamilySection,
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_ACCIDENT: Template = {
  name: 'SE_ACCIDENT',
  sections: [
    personalNumberSection,
    {
      id: 'your-home',
      title: { key: 'SECTION_TITLE_YOUR_HOME' },
      submitLabel: { key: 'SUBMIT_LABEL_PROCEED' },
      items: [
        {
          field: streetAddressField,
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: postalCodeField,
          layout: LAYOUT.HALF_WIDTH,
        },
        {
          field: livingSpaceField,
          layout: LAYOUT.HALF_WIDTH,
        },
      ],
    },
    yourFamilySection,
  ],
}
