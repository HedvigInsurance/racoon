import { SSN_SE_SECTION_ID } from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'
import { SE_PET_DOG } from './SE_PET_DOG'

export const SE_WIDGET_PET_DOG: Template = {
  name: 'SE_WIDGET_PET_DOG',
  sections: SE_PET_DOG.sections.map((section) => {
    if (section.id === SSN_SE_SECTION_ID) {
      return {
        ...section,
        editable: false,
      }
    }

    return section
  }),
}
