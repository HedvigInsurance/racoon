import { ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'
import { PriceCalculator, PriceCalculatorProps } from './PriceCalculator'
import { SWEDEN_APARTMENT_FORM } from './PriceCalculator.constants'
import { PriceForm } from './PriceCalculator.types'

export default {
  title: 'Price Calculator',
  component: PriceCalculator,
  argTypes: {
    onSubmit: { action: 'onSubmit' },
  },
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

export const OneGroupCompleted = ({ onSubmit }: PriceCalculatorProps) => {
  const form: PriceForm = {
    ...SWEDEN_APARTMENT_FORM,
    groups: [
      {
        ...SWEDEN_APARTMENT_FORM.groups[0],
        state: 'VALID',
      },
      ...SWEDEN_APARTMENT_FORM.groups.slice(1),
    ],
  }

  return <PriceCalculator form={form} onSubmit={onSubmit} />
}

export const AllGroupsCompleted = ({ onSubmit }: PriceCalculatorProps) => {
  const form: PriceForm = {
    ...SWEDEN_APARTMENT_FORM,
    groups: SWEDEN_APARTMENT_FORM.groups.map((group) => ({
      ...group,
      state: 'VALID',
    })),
  }

  return <PriceCalculator form={form} onSubmit={onSubmit} />
}
