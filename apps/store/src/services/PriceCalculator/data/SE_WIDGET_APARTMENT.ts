import {
  EXTERNAL_INSURANCE_FIELD_NAME,
  LAYOUT,
  ssnSeSection,
  studentField,
  yourApartmentSection,
  yourFamilySection,
} from '../formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_WIDGET_APARTMENT: Template = {
  name: 'SE_WIDGET_APARTMENT',
  sections: [
    {
      ...ssnSeSection,
      editable: false,
    },
    {
      ...yourApartmentSection,
      items: [
        ...yourApartmentSection.items,
        {
          field: studentField,
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
    },
    yourFamilySection,
  ],
}

export const SE_WIDGET_APARTMENT_NO_COMPARE: Template = {
  ...SE_WIDGET_APARTMENT,
  sections: SE_WIDGET_APARTMENT.sections.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.field.name !== EXTERNAL_INSURANCE_FIELD_NAME),
  })),
}
