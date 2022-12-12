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
      title: { key: 'Your home' },
      submitLabel: { key: 'Next step' },
      items: [
        {
          field: streetAddressField,
          layout: LAYOUT.HALF_WIDTH,
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
          field: {
            type: 'number',
            name: 'ancillaryArea',
            label: { key: 'Ancillary area' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'yearOfConstruction',
            label: { key: 'Year of construction' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'numberOfBathrooms',
            label: { key: 'Number of bathrooms' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'select',
            name: 'isSubleted',
            label: { key: 'Subletting' },
            required: true,
            options: [
              { label: { key: 'Yes' }, value: 'true' },
              { label: { key: 'No' }, value: 'false' },
            ],
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'extra-buildings',
            name: 'extraBuildings',
            label: { key: 'Extra buildings' },
            defaultValue: [],
            buildingOptions: [
              { label: { key: 'Garage' }, value: 'GARAGE' },
              { label: { key: 'Carport' }, value: 'CARPORT' },
              { label: { key: 'Shed' }, value: 'SHED' },
              { label: { key: 'Storehouse' }, value: 'STOREHOUSE' },
              { label: { key: 'Friggebod' }, value: 'FRIGGEBOD' },
              { label: { key: 'Attefall' }, value: 'ATTEFALL' },
              { label: { key: 'Outhouse' }, value: 'OUTHOUSE' },
              { label: { key: 'Guesthouse' }, value: 'GUESTHOUSE' },
              { label: { key: 'Gazebo' }, value: 'GAZEBO' },
              { label: { key: 'Greenhouse' }, value: 'GREENHOUSE' },
              { label: { key: 'Sauna' }, value: 'SAUNA' },
              { label: { key: 'Barn' }, value: 'BARN' },
              { label: { key: 'Boathouse' }, value: 'BOATHOUSE' },
              { label: { key: 'Other' }, value: 'OTHER' },
            ],
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
    yourFamilySection,
  ],
}
