import { setI18nNamespace, tKey } from '@/utils/i18n'
import {
  carRegistrationNumberField,
  LAYOUT,
  mileageField,
  ssnSeSection,
  yourAddressSection,
} from '../formFragments'
import type { Template } from '../PriceCalculator.types'

setI18nNamespace('purchase-form')

export const SE_CAR: Template = {
  name: 'SE_CAR',
  sections: [
    ssnSeSection,
    {
      id: 'your-car',
      title: { key: tKey('SECTION_TITLE_YOUR_CAR') },
      submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
      tooltip: { key: tKey('SECTION_TOOLTIP_YOUR_CAR') },
      items: [
        {
          field: carRegistrationNumberField,
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: mileageField,
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
      preview: {
        fieldName: carRegistrationNumberField.name,
      },
    },
    yourAddressSection,
  ],
}
