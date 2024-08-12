import { type WritableAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { ScopeProvider } from 'jotai-scope'
import React, { type ReactNode } from 'react'

type ScopeHydrationProps = {
  atomsWithValues: ReadonlyArray<readonly [WritableAtom<any, any, unknown>, any]>
  children: ReactNode
}
/*
Basic building block for non-global state represented by Jotai atoms.

Put this inside component that provides initial values and use atoms within the subtree
The recommended way to reset inner atoms is to give `key` prop to `JotaiScopeProvider` so that
when it changes (for example, user navigates from RENT to ACCIDENT product page), inner state is rehydrated

Compared to `dangerouslyForceHuydrate: true` this approach
 - is safer (prevents state updates during render)
 - is better for performance (components that read atoms in scope being navigated from are not rerendered before being removed)
 - automatically resets any stateful derived atoms without need to use `atomFamily` or similar techniques
 */
export function JotaiScopeProvider({ atomsWithValues, children }: ScopeHydrationProps) {
  // Safe to calculate on render, jotai-scope calculates difference by set equality inside
  // https://github.com/jotaijs/jotai-scope/blob/a1d7c909c46322b90cfcda73b376022420022621/src/ScopeProvider/ScopeProvider.tsx#L69
  const scopeAtoms = atomsWithValues.map((item) => item[0])
  return (
    <ScopeProvider atoms={scopeAtoms}>
      <ScopeValuesProvider atomsWithValues={atomsWithValues}>{children}</ScopeValuesProvider>
    </ScopeProvider>
  )
}

// Has to be inside `ScopeProvider`
function ScopeValuesProvider({ atomsWithValues, children }: ScopeHydrationProps) {
  useHydrateAtoms(atomsWithValues)
  return children
}
