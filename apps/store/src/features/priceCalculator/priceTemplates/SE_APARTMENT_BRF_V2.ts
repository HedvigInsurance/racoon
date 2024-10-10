import { apartmentSectionV2, ssnSeSectionV2 } from '@/services/PriceCalculator/formFragments'
import { type TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'

const SE_APARTMENT_BRF_V2: TemplateV2 = {
  name: 'SE_APARTMENT_BRF_V2',
  productName: 'SE_APARTMENT_BRF',
  sections: [ssnSeSectionV2, apartmentSectionV2],
}
export default SE_APARTMENT_BRF_V2
