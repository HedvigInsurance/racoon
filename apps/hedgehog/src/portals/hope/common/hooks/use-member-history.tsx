import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react'
import * as React from 'react'

const MEMBER_HISTORY_KEY = 'hedvig:members:history'

export const getDefaultHistory = (): ReadonlyArray<string> => {
  try {
    return (
      JSON.parse(window.sessionStorage.getItem(MEMBER_HISTORY_KEY) ?? '') ?? []
    )
  } catch {
    return []
  }
}

interface MemberHistoryContextProps {
  memberHistory: ReadonlyArray<string>
  pushToMemberHistory: (memberId: string) => void
}

export const MemberHistoryContext = createContext<MemberHistoryContextProps>({
  memberHistory: getDefaultHistory(),
  pushToMemberHistory: () => void 0,
})

export const useMemberHistory = () => useContext(MemberHistoryContext)

export const MemberHistoryProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [memberHistory, setMemberHistory] = useState(() => getDefaultHistory())

  const pushToMemberHistory = useCallback((memberId: string) => {
    setMemberHistory((prev) => {
      const newHistory = Array.from(new Set([memberId, ...prev])).slice(0, 30)
      sessionStorage.setItem(MEMBER_HISTORY_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }, [])

  return (
    <MemberHistoryContext.Provider
      value={{
        memberHistory,
        pushToMemberHistory,
      }}
    >
      {children}
    </MemberHistoryContext.Provider>
  )
}
