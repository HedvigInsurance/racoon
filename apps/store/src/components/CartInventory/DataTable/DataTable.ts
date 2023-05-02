import { setI18nNamespace, tKey } from '@/utils/i18n'

setI18nNamespace('cart')

const STREET_ROW = {
  type: 'STRING',
  key: 'street',
  label: tKey('DATA_TABLE_STREET_LABEL'),
} as const

const ZIP_CODE_ROW = {
  type: 'STRING',
  key: 'zipCode',
  label: tKey('DATA_TABLE_ZIP_CODE_LABEL'),
} as const

const LIVING_SPACE_ROW = {
  type: 'AREA',
  key: 'livingSpace',
  label: tKey('DATA_TABLE_LIVING_SPACE_LABEL'),
} as const

const HOUSEHOLD_SIZE_ROW = {
  type: 'HOUSEHOLD_SIZE',
  key: 'numberOfCoInsured',
  label: tKey('DATA_TABLE_HOUSEHOLD_SIZE_LABEL'),
} as const

const PET_NAME = {
  type: 'STRING',
  key: 'name',
  label: tKey('DATA_TABLE_PET_NAME_LABEL'),
} as const

const PET_BIRTH_DATE = {
  type: 'STRING',
  key: 'birthDate',
  label: tKey('DATA_TABLE_PET_BIRTH_DATE_LABEL'),
} as const

const BREEDS = {
  type: 'LIST',
  key: 'breeds',
  label: tKey('DATA_TABLE_BREEDS_LABEL'),
}

const DATA_TABLE = {
  SE_APARTMENT_RENT: [STREET_ROW, ZIP_CODE_ROW, LIVING_SPACE_ROW, HOUSEHOLD_SIZE_ROW],
  SE_APARTMENT_BRF: [STREET_ROW, ZIP_CODE_ROW, LIVING_SPACE_ROW, HOUSEHOLD_SIZE_ROW],
  SE_APARTMENT_STUDENT: [STREET_ROW, ZIP_CODE_ROW, LIVING_SPACE_ROW, HOUSEHOLD_SIZE_ROW],
  SE_HOUSE: [
    STREET_ROW,
    ZIP_CODE_ROW,
    LIVING_SPACE_ROW,
    { type: 'AREA', key: 'ancillaryArea', label: tKey('DATA_TABLE_ANCILLARY_AREA_LABEL') },
    {
      type: 'STRING',
      key: 'yearOfConstruction',
      label: tKey('DATA_TABLE_YEAR_OF_CONSTRUCTION_LABEL'),
    },
    HOUSEHOLD_SIZE_ROW,
  ],
  SE_ACCIDENT: [STREET_ROW, ZIP_CODE_ROW, LIVING_SPACE_ROW, HOUSEHOLD_SIZE_ROW],
  SE_CAR: [
    {
      type: 'CAR_REGISTRATION_NUMBER',
      key: 'registrationNumber',
      label: tKey('DATA_TABLE_REGISTRATION_NUMBER_LABEL'),
    },
    { type: 'MILEAGE', key: 'mileage', label: tKey('DATA_TABLE_MILEAGE_LABEL') },
    STREET_ROW,
    ZIP_CODE_ROW,
  ],
  SE_PET_CAT: [
    PET_NAME,
    {
      type: 'CAT_GENDER',
      key: 'gender',
      label: tKey('DATA_TABLE_GENDER_LABEL'),
    },
    BREEDS,
    PET_BIRTH_DATE,
    STREET_ROW,
    ZIP_CODE_ROW,
    LIVING_SPACE_ROW,
  ],
  SE_PET_DOG: [
    PET_NAME,
    {
      type: 'DOG_GENDER',
      key: 'gender',
      label: tKey('DATA_TABLE_GENDER_LABEL'),
    },
    BREEDS,
    PET_BIRTH_DATE,
    STREET_ROW,
    ZIP_CODE_ROW,
    LIVING_SPACE_ROW,
  ],
} as const

type DataTableKey = keyof typeof DATA_TABLE
type DataTable = (typeof DATA_TABLE)[DataTableKey]
export type DataTableRow = DataTable[number]

export const getDataTable = (key: string): DataTable | undefined => DATA_TABLE[key as DataTableKey]
