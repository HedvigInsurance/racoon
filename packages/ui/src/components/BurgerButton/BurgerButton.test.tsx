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

    renderWithTheme(<BurgerButton onClick={handleClick} />)

    // act
    await userEvent.click(screen.getByRole('button'))

    // assert
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(true)
  })
})
