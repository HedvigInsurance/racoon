import { renderHook } from '@testing-library/react-hooks'
import { useForm } from './use-form'

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
