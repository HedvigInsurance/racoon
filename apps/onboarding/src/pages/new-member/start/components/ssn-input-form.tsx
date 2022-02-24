import { Button, InputField, Space } from 'ui'
import React, { useState } from 'react'

import { Switch } from './switch'

export const SsnInputForm = () => {
  const [ssnValue, setSsnValue] = useState('')
  const [isCurrentAddress, setIsCurrentAddress] = useState(true)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const nonNumbersRegex = /\D/
    const ssn = value.replace(nonNumbersRegex, '')
    setSsnValue(ssn)
  }

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    console.log('ssn', ssnValue)
  }

  const handleCheckboxChange = () => {
    setIsCurrentAddress(!isCurrentAddress)
  }

  return (
    <>
      <form onSubmit={handleSubmit} id="ssn-form">
        <InputField
          label="Personal number"
          placeholder="YYYYMMDDXXXX"
          required
          value={ssnValue}
          name="ssn"
          onChange={handleInputChange}
        />
      </form>
      <Space y={3}>
        <Switch
          isChecked={isCurrentAddress}
          onChange={handleCheckboxChange}
          labelText="I want a price quote for my current address"
        />
        <Button type="submit" onClick={handleSubmit} $hasFullWidth disabled={!isCurrentAddress}>
          Get the info - Give me a price
        </Button>
      </Space>
    </>
  )
}
