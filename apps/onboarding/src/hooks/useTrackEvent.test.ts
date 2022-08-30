import { renderHook } from '@testing-library/react'
import { useTrackEvent } from './useTrackEvent'

const mockPushToGTMDataLayer = jest.fn()

jest.mock('@/services/analytics/gtm', () => ({
  pushToGTMDataLayer: (args: any) => mockPushToGTMDataLayer(args),
}))

describe('useTrackEvent', () => {
  beforeEach(() => {
    mockPushToGTMDataLayer.mockRestore()
  })

  it('should not call pushToGTMDataLayer before returned function is executed', () => {
    // align
    renderHook(() => useTrackEvent('some_event'))

    // act

    // assert
    expect(mockPushToGTMDataLayer).toHaveBeenCalledTimes(0)
  })

  it('should call pushToGTMDataLayer when returned function is executed', () => {
    // align
    const { result } = renderHook(() => useTrackEvent('some_event'))
    const track = result.current

    // act
    track()

    // assert
    expect(mockPushToGTMDataLayer).toHaveBeenCalledTimes(1)
  })

  it('should call pushToGTMDataLayer with event name', () => {
    // align
    const event = 'some_event'
    const { result } = renderHook(() => useTrackEvent(event))
    const track = result.current

    // act
    track()

    // assert
    expect(mockPushToGTMDataLayer).toHaveBeenCalledWith({ event, eventData: {} })
  })

  it('should call pushToGTMDataLayer same amount of times as returned function is executed', () => {
    // align
    const { result } = renderHook(() => useTrackEvent('some_event'))
    const track = result.current

    // act
    track()
    track()

    // assert
    expect(mockPushToGTMDataLayer).toHaveBeenCalledTimes(2)
  })

  it('should call pushToGTMDataLayer with original object', () => {
    // align
    const event = 'some_event'
    const eventData = { some: 'data' }
    const { result } = renderHook(() => useTrackEvent(event, eventData))
    const track = result.current

    // act
    track()

    // assert
    expect(mockPushToGTMDataLayer).toHaveBeenCalledWith({ event, eventData })
  })

  it('should call pushToGTMDataLayer with new object', () => {
    // align
    const event = 'some_event'
    const eventData = { some: 'data' }
    const newData = { some: 'new data', more: 'data' }
    const { result } = renderHook(() => useTrackEvent(event, eventData))
    const track = result.current

    // act
    track(newData)

    // assert
    expect(mockPushToGTMDataLayer).toHaveBeenCalledWith({ event, eventData: newData })
  })

  it('should call pushToGTMDataLayer with new object and keep original object properties if not overwritten', () => {
    // align
    const event = 'some_event'
    const eventData = { some: 'data' }
    const newData = { more: 'data' }
    const { result } = renderHook(() => useTrackEvent(event, eventData))
    const track = result.current

    // act
    track(newData)

    // assert
    expect(mockPushToGTMDataLayer).toHaveBeenCalledWith({
      event,
      eventData: { ...eventData, ...newData },
    })
  })
})
