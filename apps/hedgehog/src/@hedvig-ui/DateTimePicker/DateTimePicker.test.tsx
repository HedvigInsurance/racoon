import React from 'react'
import { DateTimePicker } from '@hedvig-ui'
import { render, screen } from '@testing-library/react'

describe('DateTimePicker', () => {
  it('renders without crashing', () => {
    render(<DateTimePicker date={null} setDate={() => void 0} />)
  })

  it('formats the date value', () => {
    const date = new Date('2022-01-01')

    render(<DateTimePicker date={date} setDate={() => void 0} />)

    expect(screen.findByDisplayValue('2022-01-01')).toBeDefined()
  })
})
