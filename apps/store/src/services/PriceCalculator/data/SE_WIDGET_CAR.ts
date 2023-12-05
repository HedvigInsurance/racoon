import { SSN_SE_SECTION_ID } from '../formFragments'
import { Template } from '../PriceCalculator.types'
import { SE_CAR } from './SE_CAR'

export const SE_WIDGET_CAR: Template = {
  name: 'SE_WIDGET_CAR',
  sections: SE_CAR.sections.map((section) => {
    if (section.id === SSN_SE_SECTION_ID) {
      return {
        ...section,
        editable: false,
      }
    }

    return section
  }),
}
