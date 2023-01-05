import { InputField } from '@/services/PriceCalculator/Field.types'
import { TemplateSection } from '@/services/PriceCalculator/PriceCalculator.types'
import { setI18nNamespace, tKey } from '@/utils/i18n'

setI18nNamespace('purchase-form')

export const LAYOUT = {
  HALF_WIDTH: { columnSpan: 3 },
  FULL_WIDTH: { columnSpan: 6 },
}

export const streetAddressField: InputField = {
  type: 'text',
  name: 'street',
  label: { key: tKey('FIELD_STREET_LABEL') },
  required: true,
}

export const postalCodeField: InputField = {
  type: 'text',
  name: 'zipCode',
  inputMode: 'numeric',
  label: { key: tKey('FIELD_ZIP_CODE_LABEL') },
  minLength: 5,
  maxLength: 5,
  required: true,
}

export const livingSpaceField: InputField = {
  type: 'number',
  name: 'livingSpace',
  label: { key: tKey('FIELD_LIVING_SPACE_LABEL') },
  required: true,
  min: 0,
  suffix: 'm²',
}

const currentInsuranceField: InputField = {
  type: 'current-insurance',
  name: 'externalInsurer',
  // TODO: Do we want promise-specific labels?
  label: { key: tKey('FIELD_EXTERNAL_INSURER_LABEL') },
}

const householdSizeField: InputField = {
  type: 'householdSize',
  name: 'numberCoInsured',
  label: { key: tKey('FIELD_HOUSEHOLD_SIZE_LABEL') },
  required: true,
  defaultValue: 0,
  max: 5,
}

export const emailField: InputField = {
  type: 'text',
  inputType: 'email',
  name: 'email',
  label: { key: tKey('FIELD_EMAIL_LABEL') },
  required: true,
}

export const carRegistrationNumberField: InputField = {
  type: 'car-registration-number',
  name: 'registrationNumber',
  label: { key: tKey('FIELD_CAR_REGISTRATION_NUMBER_LABEL') },
  required: true,
}

export const mileageField: InputField = {
  type: 'car-mileage',
  name: 'mileage',
  label: { key: tKey('FIELD_MILEAGE_LABEL') },
  required: true,
}

export const apartmentSubTypeField: InputField = {
  type: 'radio',
  name: 'subType',
  label: { key: tKey('FIELD_SUB_TYPE_APARTMENT_LABEL') },
  options: [
    {
      label: { key: tKey('FIELD_SUB_TYPE_APARTMENT_OPTION_OWN') },
      value: 'BRF',
    },
    {
      label: { key: tKey('FIELD_SUB_TYPE_APARTMENT_OPTION_RENT') },
      value: 'RENT',
    },
  ],
  required: true,
}

export const personalNumberSection: TemplateSection = {
  id: 'personal-number',
  title: { key: tKey('SECTION_TITLE_PERSONAL_NUMBER') },
  submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
  items: [
    {
      field: {
        type: 'ssn-se',
        name: 'ssn',
        label: { key: tKey('FIELD_SSN_SE_LABEL') },
        required: true,
      },
      layout: { columnSpan: 6 },
    },
  ],
}

export const yourApartmentSection = {
  id: 'your-home',
  title: { key: tKey('SECTION_TITLE_YOUR_HOME') },
  submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
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
  title: { key: tKey('SECTION_TITLE_YOUR_FAMILY') },
  submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
  items: [
    { field: householdSizeField, layout: LAYOUT.FULL_WIDTH },
    { field: emailField, layout: LAYOUT.FULL_WIDTH },
  ],
}
