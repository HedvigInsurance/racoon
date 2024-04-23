import { useState, useEffect, useCallback } from 'react'

export function useLocalSessionStorage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, (value: T | ((val: T) => T)) => void] {
  const readValue = useCallback((): T => {
    try {
      const existingValue = sessionStorage.getItem(key)

      if (existingValue) {
        return JSON.parse(existingValue) as T
      }

      if (initialValue instanceof Function) {
        return initialValue()
      }

      return initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key “${key}”:`, error)
      return initialValue instanceof Function ? initialValue() : initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue = (value: T | ((val: T) => T)): void => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      sessionStorage.setItem(key, JSON.stringify(valueToStore))
      setStoredValue(valueToStore)
    } catch (error) {
      console.warn(`Error setting sessionStorage key “${key}”:`, error)
    }
  }

  useEffect(() => {
    // This ensures if the sessionStorage key changes externally, it updates the state
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === sessionStorage) {
        setStoredValue(readValue())
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, readValue])

  return [storedValue, setValue]
}

export default useLocalSessionStorage
