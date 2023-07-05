import { renderHook } from '@testing-library/react'
import { type Level } from 'ui'
import { useBreakpoint } from './useBreakpoint'

describe('useBreakpoint', () => {
  let spy: jest.SpyInstance

  beforeEach(() => {
    spy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 0
    })
  })

  afterEach(() => {
    spy.mockRestore()
  })

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

    // prevent writing to stderr during this render
    const err = console.error
    console.error = jest.fn()

    // act
    let exception: unknown
    try {
      renderHook(() => useBreakpoint(breakpoint as Level))
    } catch (error) {
      exception = error
    }

    // assert
    expect(exception).toEqual(new Error(`Unknown breakpoint ${breakpoint}`))

    // restore writing to stderr
    console.error = err
  })
})
