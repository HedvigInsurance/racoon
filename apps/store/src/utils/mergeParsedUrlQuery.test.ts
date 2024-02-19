import { expect, test } from '@jest/globals'
import { mergeParsedUrlQuery } from './mergeParsedUrlQuery'

test('should merge search params into link URL', () => {
  const linkUrl = 'https://example.com/path'
  const search = { foo: 'bar', baz: 'qux' }
  const expected = 'https://example.com/path?foo=bar&baz=qux'
  expect(mergeParsedUrlQuery(linkUrl, search)).toEqual(expected)
})

test('should handle empty search params', () => {
  const linkUrl = 'https://example.com/path'
  const search = {}
  const expected = 'https://example.com/path'
  expect(mergeParsedUrlQuery(linkUrl, search)).toEqual(expected)
})

test('should handle existing search params in link URL', () => {
  const linkUrl = 'https://example.com/path?foo=bar'
  const search = { baz: 'qux' }
  const expected = 'https://example.com/path?foo=bar&baz=qux'
  expect(mergeParsedUrlQuery(linkUrl, search)).toEqual(expected)
})

test('should handle special characters in search params', () => {
  const linkUrl = 'https://example.com/path'
  const search = { foo: 'bar/qux' }
  const expected = 'https://example.com/path?foo=bar%2Fqux'
  expect(mergeParsedUrlQuery(linkUrl, search)).toEqual(expected)
})

test('should handle repeated search params', () => {
  const linkUrl = 'https://example.com/path'
  const search = { foo: ['bar', 'qux'] }
  const expected = 'https://example.com/path?foo=bar&foo=qux'
  expect(mergeParsedUrlQuery(linkUrl, search)).toEqual(expected)
})

test('should handle boolean search params', () => {
  const linkUrl = 'https://example.com/path'
  const search = { foo: undefined }
  const expected = 'https://example.com/path?foo='
  expect(mergeParsedUrlQuery(linkUrl, search)).toEqual(expected)
})

test('should handle relative link URLs', () => {
  const linkUrl = '/path'
  const search = { foo: 'bar' }
  const expected = '/path?foo=bar'
  expect(mergeParsedUrlQuery(linkUrl, search)).toEqual(expected)
})
