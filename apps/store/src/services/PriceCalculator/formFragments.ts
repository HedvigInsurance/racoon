import type { InputField } from '@/services/PriceCalculator/Field.types'
import type { TemplateSection } from '@/services/PriceCalculator/PriceCalculator.types'
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
  pattern: '[0-9]{5}',
}

export const livingSpaceField: InputField = {
  type: 'number',
  name: 'livingSpace',
  label: { key: tKey('FIELD_LIVING_SPACE_LABEL') },
  required: true,
  min: 0,
  suffix: 'm²',
}

export const EXTERNAL_INSURANCE_FIELD_NAME = 'externalInsurer'
export const currentInsuranceField: InputField = {
  type: 'current-insurance',
  name: EXTERNAL_INSURANCE_FIELD_NAME,
  // TODO: Do we want promise-specific labels?
  label: { key: tKey('FIELD_EXTERNAL_INSURER_LABEL') },
}

export const householdSizeField: InputField = {
  type: 'stepper',
  name: 'numberCoInsured',
  label: { key: tKey('FIELD_HOUSEHOLD_SIZE_LABEL') },
  valueLabel: { key: tKey('HOUSEHOLD_SIZE_VALUE') },
  required: true,
  defaultValue: 0,
  max: 5,
}

export const emailField: InputField = {
  type: 'text',
  inputType: 'email',
  inputMode: 'email',
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

const ssnSeField: InputField = {
  type: 'text',
  name: 'ssn',
  label: { key: tKey('FIELD_SSN_SE_LABEL') },
  required: true,
}

export const ssnSeSection: TemplateSection = {
  id: 'ssn-se',
  title: { key: tKey('SECTION_TITLE_PERSONAL_NUMBER') },
  // TODO: Ignored, remove or remodel
  submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
  items: [
    {
      field: ssnSeField,
      layout: LAYOUT.FULL_WIDTH,
    },
  ],
  preview: {
    fieldName: ssnSeField.name,
  },
}

export const yourApartmentSection: TemplateSection = {
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
  preview: {
    fieldName: streetAddressField.name,
  },
}

export const studentField: InputField = {
  type: 'radio',
  name: 'isStudent',
  label: { key: tKey('FIELD_IS_STUDENT_LABEL') },
  options: [
    {
      label: { key: tKey('LABEL_YES') },
      value: 'true',
    },
    {
      label: { key: tKey('LABEL_NO') },
      value: 'false',
    },
  ],
  required: true,
  defaultValue: 'false',
}

export const yourFamilySection: TemplateSection = {
  id: 'your-family',
  title: { key: tKey('SECTION_TITLE_YOUR_FAMILY') },
  submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
  items: [
    { field: householdSizeField, layout: LAYOUT.FULL_WIDTH },
    { field: emailField, layout: LAYOUT.FULL_WIDTH },
  ],
  preview: {
    fieldName: householdSizeField.name,
    label: { key: tKey('HOUSEHOLD_SIZE_VALUE') },
  },
}

export const yourAddressSection: TemplateSection = {
  id: 'your-address',
  title: { key: tKey('SECTION_TITLE_YOUR_ADDRESS') },
  submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
  items: [
    { field: streetAddressField, layout: LAYOUT.FULL_WIDTH },
    { field: postalCodeField, layout: LAYOUT.FULL_WIDTH },
    { field: emailField, layout: LAYOUT.FULL_WIDTH },
  ],
  preview: {
    fieldName: streetAddressField.name,
  },
}

export const yourAddressSectionWithlivingSpace: TemplateSection = {
  id: 'your-address',
  title: { key: tKey('SECTION_TITLE_YOUR_ADDRESS') },
  submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
  items: [
    { field: streetAddressField, layout: LAYOUT.FULL_WIDTH },
    { field: postalCodeField, layout: LAYOUT.HALF_WIDTH },
    { field: livingSpaceField, layout: LAYOUT.HALF_WIDTH },
    { field: emailField, layout: LAYOUT.FULL_WIDTH },
  ],
  preview: {
    fieldName: streetAddressField.name,
  },
}

export const yourAddressSectionWithLivingSpaceV2: TemplateSection = {
  id: 'your-address',
  title: { key: tKey('SECTION_TITLE_YOUR_INFORMATION') },
  subtitle: { key: tKey('SECTION_SUBTITLE_YOUR_INFORMATION') },
  submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
  items: [
    { field: streetAddressField, layout: LAYOUT.FULL_WIDTH },
    { field: postalCodeField, layout: LAYOUT.HALF_WIDTH },
    { field: livingSpaceField, layout: LAYOUT.HALF_WIDTH },
    { field: emailField, layout: LAYOUT.FULL_WIDTH },
  ],
  preview: {
    fieldName: streetAddressField.name,
  },
}

export const apartmentSectionV2: TemplateSection = {
  id: 'your-apartment',
  title: { key: tKey('SECTION_TITLE_YOUR_HOME') },
  subtitle: { key: tKey('SECTION_SUBTITLE_YOUR_HOME') },
  submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
  items: [
    { field: streetAddressField, layout: LAYOUT.FULL_WIDTH },
    { field: postalCodeField, layout: LAYOUT.HALF_WIDTH },
    { field: livingSpaceField, layout: LAYOUT.HALF_WIDTH },
    { field: householdSizeField, layout: LAYOUT.FULL_WIDTH },
    { field: emailField, layout: LAYOUT.FULL_WIDTH },
    { field: currentInsuranceField, layout: LAYOUT.FULL_WIDTH },
  ],
  preview: {
    fieldName: streetAddressField.name,
  },
}
