import { screen } from '@testing-library/react'
import { renderWithTheme } from 'ui/test-helpers'
import { QuotePriceCard } from './QuotePriceCard'

describe('QuotePriceCard', () => {
  test('can render card with text content', () => {
    renderWithTheme(<QuotePriceCard>hejhej</QuotePriceCard>)
    expect(screen.getByText('hejhej')).toBeInTheDocument()
  })

  test('can render card with title', () => {
    renderWithTheme(<QuotePriceCard title="my title">my content</QuotePriceCard>)
    expect(screen.getByText('my title')).toBeInTheDocument()
  })

  test('can render card with price', () => {
    renderWithTheme(
      <QuotePriceCard title="my title" price="1000 dollars!">
        my content
      </QuotePriceCard>,
    )
    expect(screen.getByText('1000 dollars!')).toBeInTheDocument()
  })
})
