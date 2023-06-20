import { Meta, StoryObj } from '@storybook/react'
import { SelectInsuranceGrid, Product } from './SelectInsuranceGrid'

const PRODUCTS_FIXTURE: Product[] = [
  {
    id: '1',
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

type Story = StoryObj<typeof SelectInsuranceGrid>

const meta: Meta<typeof SelectInsuranceGrid> = {
  component: SelectInsuranceGrid,
}

export const WithFewerProducts: Story = {
  render: () => <SelectInsuranceGrid products={PRODUCTS_FIXTURE.slice(0, 4)} />,
}

export const WithAllProducts: Story = {
  render: () => <SelectInsuranceGrid products={PRODUCTS_FIXTURE} />,
}

export const WithHeading: Story = {
  render: () => <SelectInsuranceGrid products={PRODUCTS_FIXTURE} heading="Select insurance" />,
}

export default meta
