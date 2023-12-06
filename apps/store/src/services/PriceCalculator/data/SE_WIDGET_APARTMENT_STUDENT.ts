import { SSN_SE_SECTION_ID } from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'
import { SE_APARTMENT_STUDENT } from './SE_APARTMENT_STUDENT'

export const SE_WIDGET_APARTMENT_STUDENT: Template = {
  name: 'SE_WIDGET_APARTMENT_STUDENT',
  sections: SE_APARTMENT_STUDENT.sections.map((section) => {
    if (section.id === SSN_SE_SECTION_ID) {
      return {
        ...section,
        editable: false,
      }
    }

    return section
  }),
}
