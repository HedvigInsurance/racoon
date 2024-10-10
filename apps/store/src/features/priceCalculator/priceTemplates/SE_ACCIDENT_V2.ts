import {
  LAYOUT,
  livingSpaceField,
  ssnSeSectionV2,
  postalCodeField,
  streetAddressField,
  emailField,
  householdSizeField,
} from '@/services/PriceCalculator/formFragments'
import { type TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'
import { setI18nNamespace, tKey } from '@/utils/i18n'

setI18nNamespace('purchase-form')

const template: TemplateV2 = {
  name: 'SE_ACCIDENT_V2',
  productName: 'SE_ACCIDENT',
  sections: [
    ssnSeSectionV2,
    {
      id: 'your-information',
      title: { key: tKey('SECTION_TITLE_YOUR_INFORMATION') },
      subtitle: { key: tKey('SECTION_SUBTITLE_YOUR_INFORMATION_ACCIDENT') },
      submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
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
        { field: householdSizeField, layout: LAYOUT.FULL_WIDTH },
        { field: emailField, layout: LAYOUT.FULL_WIDTH },
      ],
      preview: {
        fieldName: streetAddressField.name,
      },
    },
  ],
}
export default template
