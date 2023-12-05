import { SSN_SE_SECTION_ID } from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'
import { SE_STUDENT_APARTMENT } from './SE_STUDENT_APARTMENT'

export const SE_WIDGET_STUDENT_APARTMENT: Template = {
  name: 'SE_WIDGET_STUDENT_APARTMENT',
  sections: SE_STUDENT_APARTMENT.sections.map((section) => {
    if (section.id === SSN_SE_SECTION_ID) {
      return {
        ...section,
        editable: false,
      }
    }

    return section
  }),
}
