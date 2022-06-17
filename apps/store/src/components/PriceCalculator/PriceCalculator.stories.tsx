import { ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'
import { PriceCalculator } from './PriceCalculator'
import { SWEDEN_APARTMENT_FORM } from './PriceCalculator.constants'

export default {
  title: 'Price Calculator',
  component: PriceCalculator,
} as ComponentMeta<typeof PriceCalculator>

export const Default = () => {
  const [selectedForm, setSelectedForm] = useState(SWEDEN_APARTMENT_FORM)

  const handleSubmit = ({ id }: { id: string }) => {
    setSelectedForm((prevForm) => {
      const currentGroupIdx = prevForm.groups.findIndex((group) => group.id === id)

      if (currentGroupIdx === -1) throw new Error('Group not found')

      return {
        ...prevForm,
        groups: prevForm.groups.map((group, groupIdx) => ({
          ...group,
          state: groupIdx === currentGroupIdx ? 'VALID' : group.state,
        })),
      }
    })
  }

  return <PriceCalculator form={selectedForm} onSubmit={handleSubmit} />
}
