import {
  LAYOUT,
  livingSpaceField,
  personalNumberSection,
  postalCodeField,
  streetAddressField,
  yourFamilySection,
} from '@/services/PriceCalculator/formFragments'
import { Template } from '../PriceCalculator.types'

export const SE_HOUSE: Template = {
  name: 'SE_HOUSE',
  sections: [
    personalNumberSection,
    {
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
          field: {
            type: 'number',
            name: 'yearOfConstruction',
            label: { key: 'FIELD_YEAR_OF_CONSTRUCTION_LABEL' },
            required: true,
            min: 0,
          },
          layout: LAYOUT.HALF_WIDTH,
        },
        {
          field: livingSpaceField,
          layout: LAYOUT.HALF_WIDTH,
        },
        {
          field: {
            type: 'number',
            name: 'ancillaryArea',
            label: { key: 'FIELD_ANCILLARY_AREA_LABEL' },
            required: true,
            min: 0,
          },
          layout: LAYOUT.HALF_WIDTH,
        },
        {
          field: {
            type: 'number',
            name: 'numberOfBathrooms',
            label: { key: 'FIELD_NUMBER_OF_BATHROOMS_LABEL' },
            required: true,
            min: 0,
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'select',
            name: 'isSubleted',
            label: { key: 'FIELD_IS_SUBLETED_LABEL' },
            required: true,
            options: [
              { label: { key: 'FIELD_IS_SUBLETED_OPTION_YES' }, value: 'true' },
              { label: { key: 'FIELD_IS_SUBLETED_OPTION_NO' }, value: 'false' },
            ],
          },
          layout: LAYOUT.FULL_WIDTH,
        },
        {
          field: {
            type: 'extra-buildings',
            name: 'extraBuildings',
            label: { key: 'FIELD_EXTRA_BUILDINGS_LABEL' },
            defaultValue: [],
            buildingOptions: [
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_GARAGE_LABEL' }, value: 'GARAGE' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_CARPORT_LABEL' }, value: 'CARPORT' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_SHED_LABEL' }, value: 'SHED' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_STOREHOUSE_LABEL' }, value: 'STOREHOUSE' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_FRIGGEBOD_LABEL' }, value: 'FRIGGEBOD' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_ATTEFALL_LABEL' }, value: 'ATTEFALL' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_OUTHOUSE_LABEL' }, value: 'OUTHOUSE' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_GUESTHOUSE_LABEL' }, value: 'GUESTHOUSE' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_GAZEBO_LABEL' }, value: 'GAZEBO' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_GREENHOUSE_LABEL' }, value: 'GREENHOUSE' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_SAUNA_LABEL' }, value: 'SAUNA' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_BARN_LABEL' }, value: 'BARN' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_BOATHOUSE_LABEL' }, value: 'BOATHOUSE' },
              { label: { key: 'FIELD_EXTRA_BUIDLINGS_OTHER_LABEL' }, value: 'OTHER' },
            ],
          },
          layout: LAYOUT.FULL_WIDTH,
        },
      ],
    },
    yourFamilySection,
  ],
}
