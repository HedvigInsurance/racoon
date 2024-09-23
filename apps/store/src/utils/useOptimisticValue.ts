import { useState, useRef } from 'react'

type UseOptimisticValueReturn<T> = [T, (newValue: T) => void, () => void]

export function useOptimisticValue<T>(initialValue: T): UseOptimisticValueReturn<T> {
  const [value, setValue] = useState<T>(initialValue)

  const prevValueRef = useRef<T>(initialValue)

  const updateValue = (newValue: T) => {
    prevValueRef.current = value
    setValue(newValue)
  }

  const revertValue = () => {
    setValue(prevValueRef.current)
  }

  return [value, updateValue, revertValue]
}
