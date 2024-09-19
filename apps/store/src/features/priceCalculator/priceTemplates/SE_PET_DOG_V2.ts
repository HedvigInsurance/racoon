import {
  LAYOUT,
  petBirthDate,
  petNameField,
  ssnSeSectionV2,
  yourAddressSectionWithLivingSpaceV2,
} from '@/services/PriceCalculator/formFragments'
import type { TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'
import { setI18nNamespace, tKey } from '@/utils/i18n'

setI18nNamespace('purchase-form')

const template: TemplateV2 = {
  name: 'SE_PET_DOG_V2',
  productName: 'SE_PET_DOG',
  sections: [
    ssnSeSectionV2,
    {
      id: 'your-dog',
      title: { key: tKey('SECTION_TITLE_YOUR_DOG') },
      subtitle: { key: tKey('SECTION_SUBTITLE_YOUR_DOG') },
      submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
      items: [
        {
          field: petNameField,
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
          field: petBirthDate,
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
export default template
