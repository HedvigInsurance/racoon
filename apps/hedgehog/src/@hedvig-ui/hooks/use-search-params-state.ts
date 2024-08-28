import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useSearchParamsState = (
  searchParamName: string,
  defaultValue: string,
): readonly [
  searchParamsState: string,
  setSearchParamsState: (newState: string) => void,
] => {
  const [searchParams, setSearchParams] = useSearchParams()

  const acquiredSearchParam = searchParams.get(searchParamName)
  const searchParamsState = acquiredSearchParam ?? defaultValue

  const setSearchParamsState = useCallback(
    (newState: string) => {
      const next = Object.assign(
        {},
        [...searchParams.entries()].reduce(
          (o, [key, value]) => ({ ...o, [key]: value }),
          {},
        ),
        { [searchParamName]: newState },
      )
      setSearchParams(next, { replace: true })
    },
    [searchParamName, searchParams, setSearchParams],
  )

  return [searchParamsState, setSearchParamsState]
}
