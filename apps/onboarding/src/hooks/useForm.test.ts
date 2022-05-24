import { renderHook } from '@testing-library/react-hooks'
import { hasLocale, useForm } from './useForm'

describe('hasLocale', () => {
  it('should detect when locale is/is not part of a URL', () => {
    expect(hasLocale('https://www.dev.hedvigit.com/se/new-member/offer/adw8u-io123-j21io')).toBe(
      true,
    )
    expect(hasLocale('/se-en/new-member/offer/adw8u-io123-j21io')).toBe(true)

    expect(hasLocale('/new-member/offer/adw8u-io123-j21io')).toBe(false)
    expect(hasLocale('https://www.dev.hedvigit.com/forever')).toBe(false)
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
