import { ComponentProps } from 'react'
import { Dropdown } from './Dropdown'

type OnClick = ComponentProps<'div'>['onClick']

export const NonInteractableDropdown = (
  props: { onClick: OnClick } & ComponentProps<typeof Dropdown>,
) => {
  const { onClick, ...dropdownProps } = props
  return (
    <div style={{ cursor: 'pointer' }} onClick={onClick}>
      <div style={{ pointerEvents: 'none' }}>
        <Dropdown {...dropdownProps} />
      </div>
    </div>
  )
}
