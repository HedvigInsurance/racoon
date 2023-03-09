import {
  LAYOUT,
  livingSpaceField,
  ssnSeSection,
  postalCodeField,
  streetAddressField,
  petNameField,
} from '@/services/PriceCalculator/formFragments'
import { setI18nNamespace, tKey } from '@/utils/i18n'
import { Template } from '../PriceCalculator.types'

setI18nNamespace('purchase-form')

export const SE_PET_DOG: Template = {
  name: 'SE_PET_DOG',
  sections: [
    ssnSeSection,
    {
      id: 'your-dog',
      title: { key: tKey('SECTION_TITLE_YOUR_DOG') },
      submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
      items: [
        {
          field: petNameField,
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
    {
      id: 'your-address',
      title: { key: tKey('SECTION_TITLE_YOUR_ADDRESS') },
      submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
      items: [
        {
          field: streetAddressField,
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: postalCodeField,
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
    },
  ],
}
