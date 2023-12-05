import { SSN_SE_SECTION_ID } from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'
import { SE_PET_CAT } from './SE_PET_CAT'

export const SE_WIDGET_PET_CAT: Template = {
  name: 'SE_WIDGET_PET_CAT',
  sections: SE_PET_CAT.sections.map((section) => {
    if (section.id === SSN_SE_SECTION_ID) {
      return {
        ...section,
        editable: false,
      }
    }

    return section
  }),
}
