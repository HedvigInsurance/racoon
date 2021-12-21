import React, { Children, Fragment } from 'react'

type SeparateProps = {
  children: React.ReactNode
  Separator: React.ReactNode
}

export const Separate = ({ children, Separator }: SeparateProps) => {
  const array = Children.toArray(children)

  return (
    <>
      {array.map((childItem, index) => (
        <Fragment key={index}>
          {index > 0 && Separator}
          {childItem}
        </Fragment>
      ))}
    </>
  )
}
