import { Template } from '../PriceCalculator.types'

export const SE_APARTMENT_RENT: Template = {
  name: 'SE_APARTMENT_RENT',
  initialData: { subType: 'RENT' },
  sections: [
    {
      id: 'personal-number',
      title: { key: 'Personal number' },
      submitLabel: { key: 'Next step' },
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
      title: { key: 'Your Home' },
      submitLabel: { key: 'Next step' },
      items: [
        {
          field: {
            type: 'text',
            name: 'street',
            label: { key: 'Address' },
            required: true,
          },
          layout: { columnSpan: 6 },
        },
        {
          field: {
            type: 'text',
            name: 'zipCode',
            inputMode: 'numeric',
            label: { key: 'Postal code' },
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
            label: { key: 'Apartment size' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'current-insurance',
            name: 'externalInsurer',
            label: { key: 'Do you already have home insurance for this address?' },
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
    {
      id: 'your-family',
      title: { key: 'Your Family' },
      submitLabel: { key: 'Calculate price' },
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
