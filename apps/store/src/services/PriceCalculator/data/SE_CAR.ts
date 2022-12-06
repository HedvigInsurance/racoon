import {
  carRegistrationNumberField,
  LAYOUT,
  mileageField,
  personalNumberSection,
  postalCodeField,
  streetAddressField,
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_CAR: Template = {
  name: 'SE_CAR',
  sections: [
    personalNumberSection,
    {
      id: 'your-car',
      title: { key: 'SECTION_TITLE_YOUR_CAR' },
      submitLabel: { key: 'SUBMIT_LABEL_PROCEED' },
      items: [
        {
          field: carRegistrationNumberField,
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: mileageField,
          layout: { columnSpan: 6 },
        },
      ],
    },
    {
      id: 'your-address',
      title: { key: 'SECTION_TITLE_YOUR_ADDRESS' },
      submitLabel: { key: 'SUBMIT_LABEL_FINISH' },
      items: [
        { field: streetAddressField, layout: { columnSpan: 4 } },
        { field: postalCodeField, layout: { columnSpan: 2 } },
      ],
    },
  ],
}
