import { Spacing, TextDatePicker } from '@hedvig-ui'
import * as React from 'react'

export default {
  title: 'TextDatePicker',
  component: TextDatePicker,
}

export const StandardTextDatePicker: React.FC = () => {
  const [value, setValue] = React.useState<string | null>()

  return (
    <Spacing top>
      <TextDatePicker
        value={value}
        onChange={setValue}
        placeholder="Enter date string"
      />
    </Spacing>
  )
}
