import { screen } from '@testing-library/react'
import { renderWithTheme } from 'ui/test-helpers'
import { CartCard } from './CartCard'

describe('CartCard', () => {
  test('can render card with title', () => {
    renderWithTheme(<CartCard title="my title" />)
    expect(screen.getByText('my title')).toBeInTheDocument()
  })

  test('can render card with price', () => {
    renderWithTheme(<CartCard title="my title" price="1000 dollars!" />)
    expect(screen.getByText('1000 dollars!')).toBeInTheDocument()
  })
})
