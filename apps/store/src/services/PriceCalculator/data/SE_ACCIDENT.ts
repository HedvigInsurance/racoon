import {
  LAYOUT,
  livingSpaceField,
  ssnSeSection,
  postalCodeField,
  streetAddressField,
  yourFamilySection,
} from '@/services/PriceCalculator/formFragments'
import { setI18nNamespace, tKey } from '@/utils/i18n'
import { Template } from '../PriceCalculator.types'

setI18nNamespace('purchase-form')

export const SE_ACCIDENT: Template = {
  name: 'SE_ACCIDENT',
  sections: [
    ssnSeSection,
    {
      id: 'your-home',
      title: { key: tKey('SECTION_TITLE_YOUR_HOME') },
      submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
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
      preview: {
        fieldName: streetAddressField.name,
      },
    },
    yourFamilySection,
  ],
}
