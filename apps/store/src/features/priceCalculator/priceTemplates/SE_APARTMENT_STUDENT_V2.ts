import {
  apartmentSectionV2,
  apartmentSubTypeField,
  LAYOUT,
  ssnSeSection,
} from '@/services/PriceCalculator/formFragments'
import { type TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'

const SE_APARTMENT_STUDENT_V2: TemplateV2 = {
  name: 'SE_APARTMENT_STUDENT_V2',
  productName: 'SE_APARTMENT_STUDENT',
  sections: [
    ssnSeSection,
    {
      ...apartmentSectionV2,
      items: [
        apartmentSectionV2.items[0],
        {
          field: apartmentSubTypeField,
          layout: LAYOUT.FULL_WIDTH,
        },
        ...apartmentSectionV2.items.slice(1),
      ],
    },
  ],
}
export default SE_APARTMENT_STUDENT_V2
