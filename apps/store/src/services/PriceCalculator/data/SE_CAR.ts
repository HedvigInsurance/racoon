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
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'current-insurance',
            name: 'externalInsurer',
            label: { key: 'FIELD_EXTERNAL_INSURER_CAR_LABEL' },
          },
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
    },
    {
      id: 'your-address',
      title: { key: 'SECTION_TITLE_YOUR_ADDRESS' },
      submitLabel: { key: 'SUBMIT_LABEL_FINISH' },
      items: [
        { field: streetAddressField, layout: LAYOUT.FULL_WIDTH },
        { field: postalCodeField, layout: LAYOUT.FULL_WIDTH },
      ],
    },
  ],
}
