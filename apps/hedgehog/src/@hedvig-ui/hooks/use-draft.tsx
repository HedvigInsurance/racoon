'use client'

import { createContext, ReactNode, useCallback, useContext } from 'react'
import { useLocalStorage } from '@hedvig-ui'

type DraftStorage = Record<string, string>
type SetStringStateInputType = string | ((prev: string) => string)
type SetStringStateType = (value: SetStringStateInputType) => void
type StringState = [string, SetStringStateType]

const DraftContext = createContext<{
  useDraft: (id: string) => StringState
}>({
  useDraft: () => ['', () => null],
})

export const DraftProvider = ({ children }: { children: ReactNode }) => {
  const [drafts, setDrafts] = useLocalStorage<DraftStorage>('drafts', {})

  const update = (id: string, value: SetStringStateInputType) => {
    if (!value) {
      return setDrafts((prev) => {
        return Object.entries(prev)
          .filter(([key]) => key !== id)
          .reduce((acc, [key, draft]) => {
            acc[key] = draft
            return acc
          }, {} as DraftStorage)
      })
    }

    setDrafts((prev) => {
      if (!prev[id]) {
        return {
          ...prev,
          [id]: value instanceof Function ? value(prev[id]) : value,
        }
      }

      return Object.entries(prev).reduce((acc, [key, draft]) => {
        acc[key] =
          key === id
            ? value instanceof Function
              ? value(prev[id])
              : value
            : draft
        return acc
      }, {} as DraftStorage)
    })
  }

  const useDraft = (id: string): StringState => [
    drafts[id] ?? '',
    useCallback((value: SetStringStateInputType) => update(id, value), [id]),
  ]

  return (
    <DraftContext.Provider
      value={{
        useDraft,
      }}
    >
      {children}
    </DraftContext.Provider>
  )
}

export const useDraft = (id: string): StringState => {
  const { useDraft } = useContext(DraftContext)

  return useDraft(id)
}
