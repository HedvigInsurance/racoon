import { screen } from '@testing-library/react'
import { renderWithTheme } from 'ui/test-helpers'
import { CardContent } from './Card'
import { SelectableCard } from './SelectableCard'
import { SelectableCardGroup } from './SelectableCardGroup'

describe('Card', () => {
  test('can render card with text content', () => {
    renderWithTheme(<SelectableCard>hejhej</SelectableCard>)
    expect(screen.getByText('hejhej')).toBeInTheDocument()
  })

  test('can render SelectableCard with SelectableContent', () => {
    renderWithTheme(
      <SelectableCard>
        <CardContent>my content</CardContent>
      </SelectableCard>,
    )
    expect(screen.getByText('my content')).toBeInTheDocument()
  })

  test('will render as a checkbox', () => {
    renderWithTheme(<SelectableCard>hejhej</SelectableCard>)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  test('can render as a radio', () => {
    renderWithTheme(
      <SelectableCardGroup name="test" onChange={jest.fn}>
        <SelectableCard id="hej" as="radio">
          hejhej
        </SelectableCard>
      </SelectableCardGroup>,
    )
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })
})
