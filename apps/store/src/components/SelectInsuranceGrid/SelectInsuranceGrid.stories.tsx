import { Meta } from '@storybook/react'
import { ProductItem } from './ProductItem'
import { SelectInsuranceGrid } from './SelectInsuranceGrid'

export default {
  title: 'Select Insurance Grid',
  component: SelectInsuranceGrid,
} as Meta<typeof SelectInsuranceGrid>

const PRODUCTS_FIXTURE = [
  {
    id: '1',
    displayNameShort: 'Bostadsrätt',
    tagline: 'För dig, dina saker och din lägenhet',
    pageLink: '/',
  },
  {
    id: '2',
    displayNameShort: 'Hyresrätt',
    tagline: 'Brett skydd för dig som hyr bostad',
    pageLink: '/',
  },
  {
    id: '3',
    displayNameShort: 'Villa & Hus',
    tagline: 'För dig som äger hus eller villa och självklart dina saker',
    pageLink: '/',
  },
  {
    id: '4',
    displayNameShort: 'Student',
    tagline: 'Hemförsäkring fr. 49 kr/mån',
    pageLink: '/',
  },
  {
    id: '5',
    displayNameShort: 'Bil',
    tagline: 'Gäller utan bindningstid',
    pageLink: '/',
  },
  {
    id: '6',
    displayNameShort: 'Resa',
    tagline: 'För dig som vill resa tryggt',
    pageLink: '/',
  },
  {
    id: '7',
    displayNameShort: 'Fritid',
    tagline: 'För dig som äger husvagn, husbil eller båt',
    pageLink: '/',
  },
  {
    id: '8',
    displayNameShort: 'Företag',
    tagline: 'Försäkringar för företag',
    pageLink: '/',
  },
] as const

export const WithFewerProducts = () => (
  <SelectInsuranceGrid>
    {PRODUCTS_FIXTURE.slice(0, 4).map((item) => (
      <ProductItem.Root key={item.id}>
        <ProductItem.Pillow />
        <ProductItem.Content>
          <ProductItem.TitleLink href={item.pageLink}>
            {item.displayNameShort}
          </ProductItem.TitleLink>
          <ProductItem.Tagline>{item.tagline}</ProductItem.Tagline>
        </ProductItem.Content>
      </ProductItem.Root>
    ))}
  </SelectInsuranceGrid>
)

export const WithAllProducts = () => (
  <SelectInsuranceGrid>
    {PRODUCTS_FIXTURE.map((item) => (
      <ProductItem.Root key={item.id}>
        <ProductItem.Pillow />
        <ProductItem.Content>
          <ProductItem.TitleLink href={item.pageLink}>
            {item.displayNameShort}
          </ProductItem.TitleLink>
          <ProductItem.Tagline>{item.tagline}</ProductItem.Tagline>
        </ProductItem.Content>
      </ProductItem.Root>
    ))}
  </SelectInsuranceGrid>
)
