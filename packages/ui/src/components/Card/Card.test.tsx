import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../../test-helpers'
import { MailIcon } from '../../icons/MailIcon'
import { Card } from './Card'

describe('Card', () => {
  test('can render card with text content', () => {
    renderWithTheme(<Card>hejhej</Card>)
    expect(screen.getByText('hejhej')).toBeInTheDocument()
  })

  test('can render card with title', () => {
    renderWithTheme(<Card title="my title">hejhej</Card>)
    expect(screen.getByText('my title')).toBeInTheDocument()
  })

  test('can render card with extra', () => {
    renderWithTheme(<Card extra="my extra">hejhej</Card>)
    expect(screen.getByText('my extra')).toBeInTheDocument()
  })
})
