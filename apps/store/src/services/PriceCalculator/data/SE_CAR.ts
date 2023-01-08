import {
  carRegistrationNumberField,
  emailField,
  LAYOUT,
  mileageField,
  personalNumberSection,
  postalCodeField,
  streetAddressField,
} from '@/services/PriceCalculator/formFragments'
import { setI18nNamespace, tKey } from '@/utils/i18n'
import { Template } from '../PriceCalculator.types'

setI18nNamespace('purchase-form')

export const SE_CAR: Template = {
  name: 'SE_CAR',
  sections: [
    personalNumberSection,
    {
      id: 'your-car',
      title: { key: tKey('SECTION_TITLE_YOUR_CAR') },
      submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
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
            label: { key: tKey('FIELD_EXTERNAL_INSURER_CAR_LABEL') },
          },
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
    },
    {
      id: 'your-address',
      title: { key: tKey('SECTION_TITLE_YOUR_ADDRESS') },
      submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
      items: [
        { field: streetAddressField, layout: LAYOUT.FULL_WIDTH },
        { field: postalCodeField, layout: LAYOUT.FULL_WIDTH },
        { field: emailField, layout: LAYOUT.FULL_WIDTH },
      ],
    },
  ],
}
