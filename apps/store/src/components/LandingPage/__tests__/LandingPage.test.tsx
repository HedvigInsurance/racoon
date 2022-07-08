import { render, screen } from '@/test/utils'
import { LandingPage } from '../LandingPage'

describe('Landing Page', () => {
  test('can render', () => {
    render(<LandingPage />)
    expect(screen.getByText('Landing Page')).toBeInTheDocument()
  })
})
