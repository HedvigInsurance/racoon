import { PriceIntentAnimal } from '@/services/apollo/generated'
import { setI18nNamespace, tKey } from '@/utils/i18n'
import { LAYOUT, ssnSeSection } from '../formFragments'
import { yourAddressSectionWithlivingSpace } from '../formFragments'
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
            label: { key: tKey('FIELD_NAME_PET_LABEL') },
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            stacking: 'horizontal',
            name: 'gender',
            label: { key: tKey('FIELD_GENDER_LABEL') },
            required: true,
            options: [
              {
                label: { key: tKey('FIELD_GENDER_OPTION_FEMALE_CAT') },
                value: 'FEMALE',
              },
              {
                label: { key: tKey('FIELD_GENDER_OPTION_MALE_CAT') },
                value: 'MALE',
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
            label: { key: tKey('FIELD_BIRTH_DATE_PET_LABEL') },
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            name: 'isNeutered',
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
            name: 'outsideAccess',
            label: { key: tKey('FIELD_OUTSIDE_ACCESS_LABEL') },
            options: [
              {
                label: { key: tKey('FIELD_OUTSIDE_ACCESS_OPTION_NO') },
                value: 'false',
              },
              {
                label: { key: tKey('FIELD_OUTSIDE_ACCESS_OPTION_YES') },
                value: 'true',
              },
            ],
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'pet-breed',
            name: 'breed',
            animal: PriceIntentAnimal.Cat,
            label: { key: tKey('FIELD_BREED_LABEL') },
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
    },
    yourAddressSectionWithlivingSpace,
  ],
}
