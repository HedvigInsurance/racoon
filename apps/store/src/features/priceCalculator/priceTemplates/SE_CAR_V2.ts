import {
  carRegistrationNumberField,
  LAYOUT,
  mileageField,
  ssnSeSection,
  yourAddressSectionV2,
} from '@/services/PriceCalculator/formFragments'
import { type TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'
import { setI18nNamespace, tKey } from '@/utils/i18n'

setI18nNamespace('purchase-form')

const SE_CAR_V2: TemplateV2 = {
  name: 'SE_CAR_V2',
  productName: 'SE_CAR',
  sections: [
    ssnSeSection,
    {
      id: 'your-car',
      title: { key: tKey('SECTION_TITLE_YOUR_CAR') },
      subtitle: { key: tKey('SECTION_SUBTITLE_YOUR_CAR') },
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
      ],
      preview: {
        fieldName: carRegistrationNumberField.name,
      },
    },
    yourAddressSectionV2,
  ],
}
export default SE_CAR_V2
