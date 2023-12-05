import {
  SSN_SE_SECTION_ID
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'
import { SE_ACCIDENT } from './SE_ACCIDENT'


export const SE_WIDGET_ACCIDENT: Template = {
  name: 'SE_WIDGET_ACCIDENT',
  sections: SE_ACCIDENT.sections.map((section) => {
    if (section.id === SSN_SE_SECTION_ID) {
      return {
        ...section,
        editable: false,
      }
    }

    return section
  }),
}
