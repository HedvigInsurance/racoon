import { SSN_SE_SECTION_ID } from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'
import { SE_HOUSE } from './SE_HOUSE'

export const SE_WIDGET_HOUSE: Template = {
  name: 'SE_WIDGET_HOUSE',
  sections: SE_HOUSE.sections.map((section) => {
    if (section.id === SSN_SE_SECTION_ID) {
      return {
        ...section,
        editable: false,
      }
    }

    return section
  }),
}
