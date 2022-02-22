import { Button, InputField } from 'ui'
import React, { useState } from 'react'

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
      <InputField
        label="Personnummer"
        placeholder="YYYYMMDDXXXX"
        required
        value={ssnValue}
        name="ssn"
        onChange={handleInputChange}
      />
      <Button onClick={handleSubmit} $hasFullWidth>
        Hämta uppgifter - se ditt pris
      </Button>
    </form>
  )
}
