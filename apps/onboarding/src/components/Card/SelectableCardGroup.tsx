import * as RadioGroup from '@radix-ui/react-radio-group'
import React, { useEffect, useState } from 'react'
import { QuotePriceCard } from '../QuotePriceCard/QuotePriceCard'
import { SelectableCard } from './SelectableCard'

type SelectableCardGroupProps = {
  onChange: (selectedId: string) => void
  name: string
  children: React.ReactNode
}

/**
 * Apply a function to all children recursively
 */
const recursiveMap = (children: React.ReactNode, fn: (child: React.ReactNode) => void): any => {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        // @ts-expect-error child: ReactElement is enforced with isValidElement above,
        // remove casting when TypeScript stops complaining
        children: recursiveMap(child.props.children, fn),
      })
    }

    return fn(child)
  })
}

/**
 * Add `checked`, `onChange` and `as="radio"` to all child components that are either
 * `SelectableCard` or `QuotePriceCard`. This is what makes the carsd behave as radio
 * buttons, since only one can be selected at the time.
 */
const cloneChildren = (
  children: React.ReactNode,
  selectedId: string,
  callback: (id: string) => void,
) => {
  // Apply recursively, otherwise cards will have to be direct descendants, and we want
  // to be able to wrap cards in <Space> for example
  return recursiveMap(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (
      React.isValidElement(child) &&
      (child.type === SelectableCard || child.type === QuotePriceCard)
    ) {
      if (!child.props.id) {
        throw new Error('Id must be defined on child components for SelectableCardGroup')
      }

      return React.cloneElement(child, {
        // @ts-expect-error child: ReactElement is enforced with isValidElement above,
        // remove casting when TypeScript stops complaining
        checked: child.props.id === selectedId,
        onChange: () => callback(child.props.id),
        as: 'radio',
      })
    }
    return child
  })
}

export const SelectableCardGroup = ({ children, onChange, name }: SelectableCardGroupProps) => {
  const [selectedCardId, setSelectedCardId] = useState('')
  const [clonedChildren, setClonedChildren] = useState(
    cloneChildren(children, selectedCardId, setSelectedCardId),
  )

  const handleOnValueChange = (newValue: any) => {
    setSelectedCardId(newValue)
    onChange(newValue)
  }

  useEffect(() => {
    setClonedChildren(cloneChildren(children, selectedCardId, setSelectedCardId))
  }, [selectedCardId, onChange, setClonedChildren, children])

  return (
    <RadioGroup.Root name={name} onValueChange={handleOnValueChange}>
      {clonedChildren}
    </RadioGroup.Root>
  )
}
