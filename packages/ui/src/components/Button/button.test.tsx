import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  test('executes click handler', async () => {
    // align
    const handleClick = jest.fn()
    const user = userEvent.setup()

    renderWithTheme(<Button onClick={handleClick}>click me plz!</Button>)

    // act
    await user.click(screen.getByRole('button'))

    // assert
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
