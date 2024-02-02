import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test-helpers'
import { Card, CardContent } from './Card'

describe('Card', () => {
  test('can render card with text content', () => {
    renderWithTheme(<Card>hejhej</Card>)
    expect(screen.getByText('hejhej')).toBeInTheDocument()
  })

  test('can render card with CardContent', () => {
    renderWithTheme(
      <Card>
        <CardContent>my content</CardContent>
      </Card>,
    )
    expect(screen.getByText('my content')).toBeInTheDocument()
  })
})
