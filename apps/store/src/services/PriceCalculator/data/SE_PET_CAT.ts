import { setI18nNamespace, tKey } from '@/utils/i18n'
import { LAYOUT, ssnSeSection } from '../formFragments'
import { yourAddressSection } from '../formFragments'
import { Template } from '../PriceCalculator.types'

setI18nNamespace('purchase-form')

export const SE_PET_CAT: Template = {
  name: 'SE_PET_CAT',
  sections: [
    ssnSeSection,
    {
      id: 'your-cat',
      title: { key: tKey('SECTION_TITLE_YOUR_CAT') },
      submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
      items: [
        {
          field: {
            type: 'text',
            name: 'name',
            label: { key: tKey('FIELD_PET_NAME_LABEL') },
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        // TODO: replace with custom breed field
        {
          field: {
            type: 'text',
            name: 'breed',
            label: { key: 'TEMP: Breed' },
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            name: 'gender',
            label: { key: tKey('FIELD_SEX_LABEL') },
            required: true,
            options: [
              {
                label: { key: tKey('FIELD_SEX_OPTION_FEMALE_CAT') },
                value: 'female',
              },
              {
                label: { key: tKey('FIELD_SEX_OPTION_MALE_CAT') },
                value: 'male',
              },
            ],
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        // TODO: verify field type
        {
          field: {
            type: 'date',
            name: 'birthDate',
            label: { key: tKey('FIELD_PET_DATE_OF_BIRTH_LABEL') },
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            name: 'neutered',
            label: { key: tKey('FIELD_IS_NEUTERED_CAT_LABEL') },
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
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            name: 'isPetInsured',
            label: { key: tKey('FIELD_PET_HAS_INSURANCE_LABEL') },
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
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            name: 'outsideAccess',
            label: { key: tKey('FIELD_IS_OUTDOOR_CAT_LABEL') },
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
          },
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
    },
    yourAddressSection,
  ],
}
