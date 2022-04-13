import React from 'react'

type WrapProps = {
  condition?: boolean
  wrapWith: (children: React.ReactNode) => JSX.Element
  children: React.ReactNode
}

export const ConditionalWrapper = ({ condition, wrapWith, children }: WrapProps) => {
  return condition ? wrapWith(children) : <>{children}</>
}
