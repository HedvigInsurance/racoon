import {
  Button,
  Card,
  Dropdown,
  DropdownOption,
  MultiDropdown,
} from '@hedvig-ui'
import { useState } from 'react'
import {} from './dropdown'

export default {
  title: 'Dropdown',
  component: Dropdown,
  decorators: [],
}

export const DropdownWithoutSemantic = () => {
  const [selected, setSelected] = useState<number>()

  const OPTIONS = [
    'Option №1',
    <button tabIndex={-1}>Option №2</button>,
    'Option №3',
    'Option №4',
    <Card>
      <Button>Option №5</Button>
    </Card>,
    'Option №6',
    'Option №7',
  ]

  return (
    <div style={{ padding: 50 }}>
      <Dropdown placeholder="Dropdown">
        {OPTIONS.map((opt, index) => (
          <DropdownOption
            key={index}
            selected={selected === index}
            onClick={() => setSelected(index)}
          >
            {opt}
          </DropdownOption>
        ))}
      </Dropdown>
    </div>
  )
}

export const DropdownMulti = () => {
  const [selected, setSelected] = useState<string[]>([])

  const OPTIONS = [
    'Option №1',
    'Opt №2',
    'Opti №3',
    'Option №4',
    'Option №5',
    'Optn №6',
    'Option №7',
  ]

  const selectHandler = (opt: string) => {
    if (selected?.includes(opt)) {
      setSelected((prev) => prev?.filter((el) => el !== opt))
    } else {
      setSelected((prev) => [...prev, opt])
    }
  }

  return (
    <div style={{ padding: '50px 600px' }}>
      <MultiDropdown
        value={selected}
        options={OPTIONS}
        placeholder="Dropdown"
        onChange={selectHandler}
        clearHandler={() => setSelected([])}
      />
      <div style={{ marginTop: 25 }}>{selected.join(', ')}</div>
    </div>
  )
}
