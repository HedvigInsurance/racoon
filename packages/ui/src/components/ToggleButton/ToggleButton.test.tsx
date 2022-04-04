import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../../test-helpers'
import { ToggleButton } from './ToggleButton'

describe('ToggleButton', () => {
  test('can render button with text content', () => {
    renderWithTheme(<ToggleButton>hejhej</ToggleButton>)
    expect(screen.getByRole('button')).toHaveTextContent('hejhej')
  })

  test('executes toggled handler', async () => {
    // align
    const handleToggle = jest.fn()

    renderWithTheme(<ToggleButton onToggle={handleToggle}>click me plz!</ToggleButton>)

    // act
    await userEvent.click(screen.getByRole('button'))

    // assert
    expect(handleToggle).toHaveBeenCalledTimes(1)
    expect(handleToggle).toHaveBeenCalledWith(true)
  })

  test('executes toggled handler to un-toggle when initially active', async () => {
    // align
    const handleToggle = jest.fn()

    renderWithTheme(
      <ToggleButton initialActive={true} onToggle={handleToggle}>
        click me plz!
      </ToggleButton>,
    )

    // act
    await userEvent.click(screen.getByRole('button'))

    // assert
    expect(handleToggle).toHaveBeenCalledWith(false)
  })

  test('can toggle twice to activate and then deactivate', async () => {
    // align
    const handleToggle = jest.fn()

    renderWithTheme(<ToggleButton onToggle={handleToggle}>click me plz!</ToggleButton>)

    // act
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))

    // assert
    expect(handleToggle).toHaveBeenCalledTimes(2)
    expect(handleToggle).toHaveBeenCalledWith(true)
    expect(handleToggle).toHaveBeenLastCalledWith(false)
  })
})
