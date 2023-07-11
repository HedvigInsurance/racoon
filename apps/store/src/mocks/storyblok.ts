import { GlobalStory, ProductStory } from '@/services/storyblok/storyblok'

export const globalStory: GlobalStory = {
  id: 123,
  uuid: '123',
  slug: 'global',
  name: 'Global',
  full_slug: 'se-en/global',
  sort_by_date: null,
  position: 110,
  tag_list: [],
  is_startpage: false,
  parent_id: 194195645,
  meta_data: null,
  group_id: 'a903696e-a2dc-4360-b023-48327abb01ab',
  first_published_at: '2022-08-23T07:40:24.747Z',
  lang: 'default',
  alternates: [],
  created_at: '2021-03-02T10:00:00.000Z',
  published_at: '2021-03-02T10:00:00.000Z',
  content: {
    header: [],
    footer: [],
  },
}

const storyblokStory = {
  id: 123,
  alternates: [],
  full_slug: 'se-en/insurances/home-insurance/homeowner',
  created_at: '2021-03-02T10:00:00.000Z',
  group_id: '123',
  is_startpage: false,
  name: 'Homeowner',
  parent_id: 123,
  position: 0,
  published_at: '2021-03-02T10:00:00.000Z',
  first_published_at: '2021-03-02T10:00:00.000Z',
  meta_data: {},
  slug: 'homeowner',
  lang: 'en',
  uuid: '123',
  sort_by_date: '2021-03-02T10:00:00.000Z',
  tag_list: [],
}

export const productStoryBRF: ProductStory = {
  ...storyblokStory,
  content: {
    body: [],
    seoTitle: 'Homeowner Insurance in Sweden | Hedvig',
    productId: 'SE_APARTMENT_BRF',
    priceFormTemplateId: 'SE_APARTMENT_BRF',
    description: 'Condominium coverage and all-risk included',
    announcement: [],
    robots: 'index',
    globalStory: globalStory,
  },
}
