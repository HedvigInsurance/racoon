import React, { useEffect, useState } from 'react'

type SelectableCardGroupProps = {
  onChange: (selectedId: string) => void
  children: React.ReactNode
}

const cloneChildren = (
  children: React.ReactNode,
  selectedId: string,
  callback: (id: string) => void,
) => {
  return React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      if (!child.props.id) {
        throw new Error('Id must be defined on child components for SelectableCardGroup')
      }

      return React.cloneElement(child, {
        selected: child.props.id === selectedId,
        onChange: () => callback(child.props.id),
        type: 'radio',
        name: 'somename',
      })
    }
    return child
  })
}

export const SelectableCardGroup = ({ children, onChange }: SelectableCardGroupProps) => {
  const [selectedCardId, setSelectedCardId] = useState('')
  const [clonedChildren, setClonedChildren] = useState(
    cloneChildren(children, selectedCardId, setSelectedCardId),
  )

  useEffect(() => {
    onChange(selectedCardId)
    setClonedChildren(cloneChildren(children, selectedCardId, setSelectedCardId))
  }, [selectedCardId, onChange, setClonedChildren, children])

  return <>{clonedChildren}</>
}
