import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../../test-helpers'
import { BurgerButton } from './BurgerButton'

describe('BurgerButton', () => {
  test('can render button', () => {
    renderWithTheme(<BurgerButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('executes click handler', async () => {
    // align
    const handleClick = jest.fn()
    const user = userEvent.setup()

    renderWithTheme(<BurgerButton onClick={handleClick} />)

    // act
    await user.click(screen.getByRole('button'))

    // assert
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(true)
  })
})
