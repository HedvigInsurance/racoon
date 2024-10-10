import {
  currentInsuranceField,
  emailField,
  householdSizeField,
  LAYOUT,
  livingSpaceField,
  postalCodeField,
  ssnSeSectionV2,
  streetAddressField,
  useRegistrationAddressField,
} from '@/services/PriceCalculator/formFragments'
import { type TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'
import { tKey } from '@/utils/i18n'

const SE_HOUSE_V2: TemplateV2 = {
  name: 'SE_HOUSE_V2',
  productName: 'SE_HOUSE',
  sections: [
    ssnSeSectionV2,
    {
      id: 'your-home',
      title: { key: tKey('SECTION_TITLE_YOUR_HOME') },
      subtitle: { key: tKey('SECTION_SUBTITLE_YOUR_HOME') },
      submitLabel: { key: tKey('SUBMIT_LABEL_PROCEED') },
      items: [
        {
          field: useRegistrationAddressField,
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: streetAddressField,
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: postalCodeField,
          layout: LAYOUT.FULL_WIDTH,
        },

        {
          field: livingSpaceField,
          layout: LAYOUT.HALF_WIDTH,
        },
        {
          field: {
            type: 'number',
            name: 'ancillaryArea',
            label: { key: tKey('FIELD_ANCILLARY_AREA_LABEL') },
            required: true,
            suffix: 'm²',
            min: 0,
          },
          layout: LAYOUT.HALF_WIDTH,
        },
        {
          field: householdSizeField,
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: emailField,
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: currentInsuranceField,
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
      preview: {
        fieldName: streetAddressField.name,
      },
    },
    {
      id: 'building-details',
      title: { key: tKey('SECTION_TITLE_BUILDING_DETAILS') },
      subtitle: { key: tKey('SECTION_SUBTITLE_BUILDING_DETAILS') },
      submitLabel: { key: tKey('SUBMIT_LABEL_FINISH') },
      items: [
        {
          field: {
            type: 'number',
            name: 'yearOfConstruction',
            label: { key: tKey('FIELD_YEAR_OF_CONSTRUCTION_LABEL') },
            required: true,
            min: 0,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'stepper',
            name: 'numberOfBathrooms',
            label: { key: tKey('FIELD_NUMBER_OF_BATHROOMS_LABEL') },
            valueLabel: { key: tKey('FIELD_NUMBER_OF_BATHROOMS_VALUE') },
            required: true,
            min: 1,
            max: 10,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'radio',
            name: 'isSubleted',
            label: { key: tKey('FIELD_IS_SUBLETED_LABEL') },
            required: true,
            options: [
              { label: { key: tKey('FIELD_IS_SUBLETED_OPTION_YES') }, value: 'true' },
              { label: { key: tKey('FIELD_IS_SUBLETED_OPTION_NO') }, value: 'false' },
            ],
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'extra-buildings',
            name: 'extraBuildings',
            label: { key: tKey('FIELD_EXTRA_BUILDINGS_LABEL') },
            defaultValue: [],
            // There's a typo in all keys below (buiDLings)
            // If you want to fix this, keep in mind that we share the keys with Android app
            buildingOptions: [
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_GARAGE_LABEL') }, value: 'GARAGE' },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_CARPORT_LABEL') }, value: 'CARPORT' },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_SHED_LABEL') }, value: 'SHED' },
              {
                label: { key: tKey('FIELD_EXTRA_BUIDLINGS_STOREHOUSE_LABEL') },
                value: 'STOREHOUSE',
              },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_FRIGGEBOD_LABEL') }, value: 'FRIGGEBOD' },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_ATTEFALL_LABEL') }, value: 'ATTEFALL' },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_OUTHOUSE_LABEL') }, value: 'OUTHOUSE' },
              {
                label: { key: tKey('FIELD_EXTRA_BUIDLINGS_GUESTHOUSE_LABEL') },
                value: 'GUESTHOUSE',
              },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_GAZEBO_LABEL') }, value: 'GAZEBO' },
              {
                label: { key: tKey('FIELD_EXTRA_BUIDLINGS_GREENHOUSE_LABEL') },
                value: 'GREENHOUSE',
              },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_SAUNA_LABEL') }, value: 'SAUNA' },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_BARN_LABEL') }, value: 'BARN' },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_BOATHOUSE_LABEL') }, value: 'BOATHOUSE' },
              { label: { key: tKey('FIELD_EXTRA_BUIDLINGS_OTHER_LABEL') }, value: 'OTHER' },
            ],
          },
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
      preview: {
        fieldName: 'yearOfConstruction',
        label: { key: tKey('FIELD_YEAR_OF_CONSTRUCTION_LABEL') },
      },
    },
  ],
}
export default SE_HOUSE_V2
