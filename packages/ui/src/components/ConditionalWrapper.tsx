import React from 'react'

type WrapProps = {
  if?: boolean
  with: (children: React.ReactNode) => JSX.Element
  children: React.ReactNode
}

export const ConditionalWrapper = ({ if: condition, with: wrapper, children }: WrapProps) => {
  return condition ? wrapper(children) : <>{children}</>
}
