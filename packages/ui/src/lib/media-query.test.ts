import { renderHook } from '@testing-library/react-hooks'
import { Level, useBreakpoint } from './media-query'

describe('media-query', () => {
  describe('useBreakpoint', () => {
    it('should return true when window is larger than breakpoint', () => {
      // align

      // act
      const { result } = renderHook(() => useBreakpoint('md'))

      // assert
      expect(result.current).toBeTruthy()
    })

    it('should return false when window is smaller than breakpoint', () => {
      // align
      global.innerWidth = 230

      // act
      const { result } = renderHook(() => useBreakpoint('md'))

      // assert
      expect(result.current).toBeFalsy()
    })

    it('should throw when using an unknown breakpoint', () => {
      // align
      const breakpoint = 'smurf'

      // Suppress log
      jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})

      // act
      const { result } = renderHook(() => useBreakpoint(breakpoint as Level))
      // assert
      expect(result.error).toEqual(new Error(`Unknown breakpoint ${breakpoint}`))
    })
  })
})
