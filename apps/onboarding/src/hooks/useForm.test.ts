import { renderHook } from '@testing-library/react'
import { hasLocale, useForm } from './useForm'

describe('hasLocale', () => {
  it.each([
    ['https://www.dev.hedvigit.com/se/new-member/offer/adw8u-io123-j21io', true],
    ['/se-en/new-member/offer/adw8u-io123-j21io', true],
    ['/new-member/offer/adw8u-io123-j21io', false],
    ['https://www.dev.hedvigit.com/forever', false],
  ])('should detect when locale is/is not part of a URL', (url, expected) => {
    expect(hasLocale(url)).toBe(expected)
  })
})

describe('useForm hook', () => {
  it('should setup form state', () => {
    // align

    // act
    const { result } = renderHook(() => useForm({ action: '/api/respond', method: 'post' }))

    // assert
    expect(result.current.state).toBe('idle')
    expect(result.current.errors).toBe(null)
    expect(result.current.formProps.method).toEqual('post')
    expect(result.current.formProps.onSubmit).toBeInstanceOf(Function)
  })
})
