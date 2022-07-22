import { CartCard } from './CartCard'
import { renderWithTheme } from '../../../test-helpers'
import { screen } from '@testing-library/react'

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
