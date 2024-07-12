import {
  LAYOUT,
  ssnSeSection,
  yourAddressSectionWithLivingSpaceV2,
} from '@/services/PriceCalculator/formFragments'
import type { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { setI18nNamespace, tKey } from '@/utils/i18n'

setI18nNamespace('purchase-form')

export const SE_PET_DOG_V2: Template = {
  name: 'SE_PET_DOG_V2',
  sections: [
    ssnSeSection,
    {
      id: 'your-dog',
      title: { key: tKey('SECTION_TITLE_YOUR_DOG') },
      subtitle: { key: tKey('SECTION_SUBTITLE_YOUR_DOG') },
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
            type: 'pet-dog-breeds',
            name: 'breeds',
            label: { key: tKey('FIELD_BREED_LABEL') },
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'date',
            name: 'birthDate',
            label: { key: tKey('FIELD_BIRTH_DATE_PET_LABEL') },
            required: true,
            // Arbitrary date range to be able to show year dropdown
            // UW filter breeches are handled by the backend
            min: '1990-01-01',
            max: 'TODAY',
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            name: 'gender',
            label: { key: tKey('FIELD_GENDER_LABEL') },
            options: [
              { label: { key: tKey('FIELD_GENDER_OPTION_MALE_DOG') }, value: 'MALE' },
              { label: { key: tKey('FIELD_GENDER_OPTION_FEMALE_DOG') }, value: 'FEMALE' },
            ],
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            name: 'isNeutered',
            label: { key: tKey('FIELD_IS_NEUTERED_DOG_LABEL') },
            options: [
              { label: { key: tKey('LABEL_YES') }, value: 'true' },
              { label: { key: tKey('LABEL_NO') }, value: 'false' },
            ],
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            name: 'isPreviousDogOwner',
            label: { key: tKey('FIELD_PREVIOUS_DOG_OWNER_LABEL') },
            options: [
              { label: { key: tKey('LABEL_YES') }, value: 'true' },
              { label: { key: tKey('LABEL_NO') }, value: 'false' },
            ],
            required: true,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
      preview: {
        fieldName: 'name',
      },
    },
    yourAddressSectionWithLivingSpaceV2,
  ],
}
