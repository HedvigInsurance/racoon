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

export const currentInsuranceField: InputField = {
  type: 'current-insurance',
  name: 'externalInsurer',
  // TODO: Do we want promise-specific labels?
  label: { key: tKey('FIELD_EXTERNAL_INSURER_LABEL') },
}

const householdSizeField: InputField = {
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

export const petNameField: InputField = {
  type: 'text',
  name: 'petName',
  label: { key: tKey('FIELD_PET_NAME_LABEL') },
  required: true,
}

export const petBreedField: InputField = {
  type: 'text',
  name: 'petBreed',
  label: { key: tKey('FIELD_PET_BREED_LABEL') },
  required: true,
}

export const petSexFieldDog: InputField = {
  type: 'select',
  name: 'petSex',
  label: { key: tKey('FIELD_PET_SEX_LABEL') },
  options: [
    { label: { key: tKey('FIELD_PET_SEX_OPTION_MALE_DOG') }, value: 'male' },
    { label: { key: tKey('FIELD_PET_SEX_OPTION_FEMALE_DOG') }, value: 'female' },
  ],
  required: true,
}

export const petDateOfBirthField: InputField = {
  type: 'date',
  name: 'petDateOfBirth',
  label: { key: tKey('FIELD_PET_DATE_OF_BIRTH_LABEL') },
  required: true,
}
export const petIsNeuteredDogField: InputField = {
  type: 'radio',
  name: 'petIsCastrated',
  label: { key: tKey('FIELD_IS_NEUTERED_DOG_LABEL') },
  options: [
    { label: { key: tKey('LABEL_YES') }, value: 'true' },
    { label: { key: tKey('LABEL_NO') }, value: 'false' },
  ],
  required: true,
}

export const petHasInsuranceField: InputField = {
  type: 'radio',
  name: 'petHasInsurance',
  label: { key: tKey('FIELD_PET_HAS_INSURANCE_LABEL') },
  options: [
    { label: { key: tKey('LABEL_YES') }, value: 'true' },
    { label: { key: tKey('LABEL_NO') }, value: 'false' },
  ],
  required: true,
}

export const previousDogOwnerField: InputField = {
  type: 'radio',
  name: 'previousDogOwner',
  label: { key: tKey('FIELD_PREVIOUS_DOG_OWNER_LABEL') },
  options: [
    { label: { key: tKey('LABEL_YES') }, value: 'true' },
    { label: { key: tKey('LABEL_NO') }, value: 'false' },
  ],
  required: true,
}

export const ssnSeSection: TemplateSection = {
  id: 'ssn-se',
  title: { key: tKey('SECTION_TITLE_PERSONAL_NUMBER') },
  // TODO: Ignored, remove or remodel
  submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
  items: [
    {
      field: {
        type: 'text',
        name: 'ssn',
        label: { key: tKey('FIELD_SSN_SE_LABEL') },
        required: true,
      },
      layout: LAYOUT.FULL_WIDTH,
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

export const yourAddressSection = {
  id: 'your-address',
  title: { key: tKey('SECTION_TITLE_YOUR_ADDRESS') },
  submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
  items: [
    { field: streetAddressField, layout: LAYOUT.FULL_WIDTH },
    { field: postalCodeField, layout: LAYOUT.FULL_WIDTH },
    { field: emailField, layout: LAYOUT.FULL_WIDTH },
  ],
}
