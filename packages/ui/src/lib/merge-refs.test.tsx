import { render } from '@testing-library/react'
import { forwardRef, useImperativeHandle } from 'react'
import { mergeRefs } from './merge-refs'

test('mergeRefs', () => {
  const Dummy = forwardRef(function Dummy(_, ref) {
    useImperativeHandle(ref, () => 'refValue')
    return null
  })

  const refAsFunc = jest.fn()
  const refAsObj = { current: undefined }
  const Example = ({ visible }: { visible: boolean }) => {
    return visible ? <Dummy ref={mergeRefs([refAsObj, refAsFunc])} /> : null
  }

  // Both refs ('refAsFunc' and 'refAsObj') get updated after mounting <Dummy />
  const { rerender } = render(<Example visible={true} />)
  expect(refAsFunc).toHaveBeenCalledTimes(1)
  expect(refAsFunc).toHaveBeenCalledWith('refValue')
  expect(refAsObj.current).toBe('refValue')

  // Both refs ('refAsFunc' and 'refAsObj') get updated after unmouting <Dummy />
  rerender(<Example visible={false} />)
  expect(refAsFunc).toHaveBeenCalledTimes(2)
  expect(refAsFunc).toHaveBeenCalledWith(null)
  expect(refAsObj.current).toBe(null)
})
