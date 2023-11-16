import { describe, it, expect } from '@jest/globals'
import { mergeSearchParams } from './mergeSearchParams'

describe('mergeSearchParams', () => {
  it('should merge search params into link URL', () => {
    const linkUrl = 'https://example.com/path'
    const search = { foo: 'bar', baz: 'qux' }
    const expected = 'https://example.com/path?foo=bar&baz=qux'
    expect(mergeSearchParams(linkUrl, search)).toEqual(expected)
  })

  it('should handle empty search params', () => {
    const linkUrl = 'https://example.com/path'
    const search = {}
    const expected = 'https://example.com/path'
    expect(mergeSearchParams(linkUrl, search)).toEqual(expected)
  })

  it('should handle existing search params in link URL', () => {
    const linkUrl = 'https://example.com/path?foo=bar'
    const search = { baz: 'qux' }
    const expected = 'https://example.com/path?foo=bar&baz=qux'
    expect(mergeSearchParams(linkUrl, search)).toEqual(expected)
  })

  it('should handle special characters in search params', () => {
    const linkUrl = 'https://example.com/path'
    const search = { foo: 'bar/qux' }
    const expected = 'https://example.com/path?foo=bar%2Fqux'
    expect(mergeSearchParams(linkUrl, search)).toEqual(expected)
  })

  it('should handle repeated search params', () => {
    const linkUrl = 'https://example.com/path'
    const search = { foo: ['bar', 'qux'] }
    const expected = 'https://example.com/path?foo=bar&foo=qux'
    expect(mergeSearchParams(linkUrl, search)).toEqual(expected)
  })

  it('should handle boolean search params', () => {
    const linkUrl = 'https://example.com/path'
    const search = { foo: undefined }
    const expected = 'https://example.com/path?foo='
    expect(mergeSearchParams(linkUrl, search)).toEqual(expected)
  })

  it('should handle relative link URLs', () => {
    const linkUrl = '/path'
    const search = { foo: 'bar' }
    const expected = '/path?foo=bar'
    expect(mergeSearchParams(linkUrl, search)).toEqual(expected)
  })
})
