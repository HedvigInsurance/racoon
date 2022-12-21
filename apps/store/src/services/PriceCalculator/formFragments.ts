import { InputField } from '@/services/PriceCalculator/Field.types'
import { TemplateSection } from '@/services/PriceCalculator/PriceCalculator.types'

export const LAYOUT = {
  HALF_WIDTH: { columnSpan: 3 },
  FULL_WIDTH: { columnSpan: 6 },
}

export const streetAddressField: InputField = {
  type: 'text',
  name: 'street',
  label: { key: 'FIELD_STREET_LABEL' },
  required: true,
}

export const postalCodeField: InputField = {
  type: 'text',
  name: 'zipCode',
  inputMode: 'numeric',
  label: { key: 'FIELD_ZIP_CODE_LABEL' },
  minLength: 5,
  maxLength: 5,
  required: true,
}

export const livingSpaceField: InputField = {
  type: 'number',
  name: 'livingSpace',
  label: { key: 'FIELD_LIVING_SPACE_LABEL' },
  required: true,
  min: 0,
  suffix: 'm²',
}

export const currentInsuranceField: InputField = {
  type: 'current-insurance',
  name: 'externalInsurer',
  // TODO: Do we want promise-specific labels?
  label: { key: 'FIELD_EXTERNAL_INSURER_LABEL' },
}

export const householdSizeField: InputField = {
  type: 'householdSize',
  name: 'numberCoInsured',
  label: { key: 'Household size' },
  required: true,
  defaultValue: 0,
  max: 5,
}

export const carRegistrationNumberField: InputField = {
  type: 'car-registration-number',
  name: 'registrationNumber',
  label: { key: 'FIELD_CAR_REGISTRATION_NUMBER_LABEL' },
  required: true,
}

export const mileageField: InputField = {
  type: 'car-mileage',
  name: 'mileage',
  label: { key: 'FIELD_MILEAGE_LABEL' },
  required: true,
  // TODO: Localize with single key + param
  // options: [
  //   { label: { key: '10 000 km/year' }, value: '1000' },
  //   { label: { key: '15 000 km/year' }, value: '1500' },
  //   { label: { key: '20 000 km/year' }, value: '2000' },
  //   { label: { key: '25 000 km/year' }, value: '2500' },
  //   { label: { key: '20 500+ km/year' }, value: '2501' },
  // ],
}

export const personalNumberSection: TemplateSection = {
  id: 'personal-number',
  title: { key: 'SECTION_TITLE_PERSONAL_NUMBER' },
  submitLabel: { key: 'SUBMIT_LABEL_PROCEED' },
  items: [
    {
      field: {
        type: 'ssn-se',
        name: 'ssn',
        label: { key: 'FIELD_SSN_SE_LABEL' },
        required: true,
      },
      layout: { columnSpan: 6 },
    },
  ],
}

export const yourApartmentSection = {
  id: 'your-home',
  title: { key: 'SECTION_TITLE_YOUR_HOME' },
  submitLabel: { key: 'SUBMIT_LABEL_PROCEED' },
  items: [
    {
      field: streetAddressField,
      layout: LAYOUT.FULL_WIDTH,
    },
    {
      field: postalCodeField,
      layout: LAYOUT.HALF_WIDTH,
    },
    {
      field: livingSpaceField,
      layout: LAYOUT.HALF_WIDTH,
    },
    {
      field: currentInsuranceField,
      layout: LAYOUT.FULL_WIDTH,
    },
  ],
}

export const yourFamilySection = {
  id: 'your-family',
  title: { key: 'SECTION_TITLE_YOUR_FAMILY' },
  submitLabel: { key: 'SUBMIT_LABEL_FINISH' },
  items: [{ field: householdSizeField, layout: LAYOUT.FULL_WIDTH }],
}
