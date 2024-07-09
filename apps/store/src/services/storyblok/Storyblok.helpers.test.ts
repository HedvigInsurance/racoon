import { test, expect } from '@jest/globals'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { ORIGIN_URL } from '@/utils/url'

const link = {
  id: '9c9cfdce-075c-426a-b0c8-9053c59dd40e',
  url: '',
  linktype: 'story' as const,
  fieldtype: 'multilink',
  cached_url: 'se-en/insurances/home-insurance/',
  story: {
    name: 'Home Insurance',
    id: 293342693,
    uuid: '9c9cfdce-075c-426a-b0c8-9053c59dd40e',
    slug: 'home-insurance',
    url: 'se-en/insurances/home-insurance/',
    full_slug: 'se-en/insurances/home-insurance/',
    _stopResolving: true,
  },
}

test('getLinkFieldURL should return the full URL without trailing slash when given a link object', () => {
  const result = getLinkFieldURL(link, 'Home Insurance')

  const expectedUrl = `${ORIGIN_URL}/se-en/insurances/home-insurance`

  expect(result).toBe(expectedUrl)
})
