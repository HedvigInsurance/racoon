import { ssnSeSection, yourApartmentAndStudentSection, yourFamilySection } from '../formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_WIDGET_APARTMENT_BRF: Template = {
  name: 'SE_WIDGET_APARTMENT_BRF',
  sections: [ssnSeSection, yourApartmentAndStudentSection, yourFamilySection],
}
