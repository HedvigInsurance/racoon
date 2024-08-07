import type { Meta, StoryObj } from '@storybook/react'
import { type ProductFragment } from '@/services/graphql/generated'
import { SelectInsuranceGrid } from './SelectInsuranceGrid'

const PRODUCTS_FIXTURE: Array<ProductFragment> = [
  {
    id: '1',
    name: 'SE_APARTMENT_BRF',
    displayNameShort: 'Bostadsrätt',
    displayNameFull: 'Hemförsäkring Bostadsrätt',
    tagline: 'För dig, dina saker och din lägenhet',
    pageLink: '/',
    pillowImage: {
      id: 'pillowImage:1',
      src: 'https://placehold.co/48x48',
    },
  },
  {
    id: '2',
    name: 'SE_APARTMENT_RENT',
    displayNameShort: 'Hyresrätt',
    displayNameFull: 'Hemförsäkring Hyresrätt',
    tagline: 'Brett skydd för dig som hyr bostad',
    pageLink: '/',
    pillowImage: {
      id: 'pillowImage:2',
      src: 'https://placehold.co/48x48',
    },
  },
  {
    id: '3',
    name: 'SE_HOUSE',
    displayNameShort: 'Villa & Hus',
    displayNameFull: 'Villaförsäkring',
    tagline: 'För dig som äger hus eller villa och självklart dina saker',
    pageLink: '/',
    pillowImage: {
      id: 'pillowImage:3',
      src: 'https://placehold.co/48x48',
    },
  },
  {
    id: '4',
    name: 'SE_APARTMENT_STUDENT',
    displayNameShort: 'Student',
    displayNameFull: 'Hemförsäkring Student',
    tagline: 'Hemförsäkring fr. 49 kr/mån',
    pageLink: '/',
    pillowImage: {
      id: 'pillowImage:4',
      src: 'https://placehold.co/48x48',
    },
  },
  {
    id: '5',
    name: 'SE_CAR',
    displayNameShort: 'Bil',
    displayNameFull: 'Bilförsäkring',
    tagline: 'Gäller utan bindningstid',
    pageLink: '/',
    pillowImage: {
      id: 'pillowImage:5',
      src: 'https://placehold.co/48x48',
    },
  },
  {
    id: '6',
    name: 'SE_FAKE_TRAVEL',
    displayNameShort: 'Resa',
    displayNameFull: 'Resaförsäkring',
    tagline: 'För dig som vill resa tryggt',
    pageLink: '/',
    pillowImage: {
      id: 'pillowImage:6',
      src: 'https://placehold.co/48x48',
    },
  },
  {
    id: '7',
    name: 'SE_FAKE_FREE_TIME',
    displayNameShort: 'Fritid',
    displayNameFull: 'Fritidförsäkring',
    tagline: 'För dig som äger husvagn, husbil eller båt',
    pageLink: '/',
    pillowImage: {
      id: 'pillowImage:7',
      src: 'https://placehold.co/48x48',
    },
  },
  {
    id: '8',
    name: 'SE_BUSINESS',
    displayNameShort: 'Företag',
    displayNameFull: 'Företagförsäkring',
    tagline: 'Försäkringar för företag',
    pageLink: '/',
    pillowImage: {
      id: 'pillowImage:8',
      src: 'https://placehold.co/48x48',
    },
  },
]

const meta: Meta<typeof SelectInsuranceGrid> = {
  component: SelectInsuranceGrid,
}

export default meta
type Story = StoryObj<typeof SelectInsuranceGrid>

export const WithFewerProducts: Story = {
  render: () => <SelectInsuranceGrid products={PRODUCTS_FIXTURE.slice(0, 4)} />,
}

export const WithAllProducts: Story = {
  render: () => <SelectInsuranceGrid products={PRODUCTS_FIXTURE} />,
}

export const WithHeading: Story = {
  render: () => <SelectInsuranceGrid products={PRODUCTS_FIXTURE} heading="Select insurance" />,
}
