import React, { Children, Fragment } from 'react'

type SeparateProps = {
  children: React.ReactNode
  Separator: React.ReactNode
  className?: string
  as?: React.ElementType
}

export const Separate = ({
  children,
  Separator,
  className,
  as: Element = 'div',
}: SeparateProps) => {
  const array = Children.toArray(children)

  const childrenWithSeparators = array.map((childItem, index) => (
    <Fragment key={index}>
      {index > 0 && Separator}
      {childItem}
    </Fragment>
  ))

  if (className) {
    return <Element className={className}>{childrenWithSeparators}</Element>
  }

  return <>{childrenWithSeparators}</>
}
