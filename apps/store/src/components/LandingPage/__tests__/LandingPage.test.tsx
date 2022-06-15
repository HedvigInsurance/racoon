import { screen } from '@testing-library/react'
import { render } from '@/test/utils'
import { LandingPage } from '../LandingPage'

describe('Landing Page', () => {
  test('can render', () => {
    render(<LandingPage />)
    expect(screen.getByText('Not yet implemented')).toBeInTheDocument()
  })
})
