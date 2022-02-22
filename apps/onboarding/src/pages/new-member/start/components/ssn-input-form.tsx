import { Button, InputField, Space } from 'ui'
import React, { useState } from 'react'

import { Switch } from './switch'

export const SsnInputForm = () => {
  const [ssnValue, setSsnValue] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const nonNumbersRegex = /\D/
    const newSsn = value.replace(nonNumbersRegex, '')
    setSsnValue(newSsn)
  }

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    console.log('ssn', ssnValue)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Space y={1}>
        <InputField
          label="Personnummer"
          placeholder="YYYYMMDDXXXX"
          required
          value={ssnValue}
          name="ssn"
          onChange={handleInputChange}
        />
        <Switch labelText="Är det din nuvarande adress?" />
        <Button onClick={handleSubmit} $hasFullWidth>
          Hämta uppgifter - se ditt pris
        </Button>
      </Space>
    </form>
  )
}
