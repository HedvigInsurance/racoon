import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test-helpers'
import { MailIcon } from '../../icons/MailIcon'
import { Button } from './button'

describe('Button', () => {
  test('can render button with text content', () => {
    renderWithTheme(<Button>hejhej</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('hejhej')
  })

  test('can render button with icon', () => {
    const { container } = renderWithTheme(<Button icon={<MailIcon />} />)

    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
