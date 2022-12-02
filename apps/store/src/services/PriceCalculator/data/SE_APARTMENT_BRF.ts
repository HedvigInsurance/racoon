import { Template } from '../PriceCalculator.types'

export const SE_APARTMENT_BRF: Template = {
  name: 'SE_APARTMENT_BRF',
  initialData: { subType: 'BRF' },
  sections: [
    {
      id: 'personal-number',
      title: { key: 'SECTION_TITLE_PERSONAL_NUMBER' },
      submitLabel: { key: 'SUBMIT_LABEL_PROCEED' },
      items: [
        {
          field: {
            type: 'ssn-se',
            name: 'ssn',
            label: { key: 'ÅÅMMDD-XXXX' },
            required: true,
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
    {
      id: 'your-home',
      title: { key: 'SECTION_TITLE_YOUR_HOME' },
      submitLabel: { key: 'SUBMIT_LABEL_PROCEED' },
      items: [
        {
          field: {
            type: 'text',
            name: 'street',
            label: { key: 'FIELD_STREET_LABEL' },
            required: true,
          },
          layout: { columnSpan: 6 },
        },
        {
          field: {
            type: 'text',
            name: 'zipCode',
            inputMode: 'numeric',
            label: { key: 'FIELD_ZIP_CODE_LABEL' },
            minLength: 5,
            maxLength: 5,
            required: true,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'livingSpace',
            label: { key: 'FIELD_LIVING_SPACE_LABEL' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'current-insurance',
            name: 'externalInsurer',
            label: { key: 'FIELD_EXTERNAL_INSURER_LABEL' },
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
    {
      id: 'your-family',
      title: { key: 'SECTION_TITLE_YOUR_FAMILY' },
      submitLabel: { key: 'SUBMIT_LABEL_FINISH' },
      items: [
        {
          field: {
            type: 'householdSize',
            name: 'numberCoInsured',
            label: { key: 'Household size' },
            required: true,
            defaultValue: 0,
            max: 5,
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
  ],
}
