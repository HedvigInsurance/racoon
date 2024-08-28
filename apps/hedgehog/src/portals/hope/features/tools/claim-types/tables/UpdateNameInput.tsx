import { Button, Flex, Input } from '@hedvig-ui'
import { useState } from 'react'
import * as React from 'react'

export const UpdateNameInput: React.FC<{
  initial: string
  onSubmit: (value: string) => void
  disabled: boolean
}> = ({ initial, onSubmit, disabled }) => {
  const [value, setValue] = useState(initial)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(value)
      }}
      style={{ width: '100%' }}
    >
      <Flex align="center">
        <Input
          autoFocus
          size="small"
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        <Button type="submit" style={{ marginLeft: '1em' }}>
          Update
        </Button>
      </Flex>
    </form>
  )
}
