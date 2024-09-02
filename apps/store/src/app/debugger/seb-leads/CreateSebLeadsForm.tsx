'use client'

import { useFormState } from 'react-dom'
import { Alert, yStack } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { ErrorMessages } from '@/components/FormErrors/ErrorMessages'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { TextField } from '@/components/TextField/TextField'
import { createSebLead } from './createSebLead'
import { SEBFormElement } from './types'

const PRODUCT_OPTIONS = [
  { name: 'SE_CAR (carInsurance)', value: 'carInsurance' },
  { name: 'SE_ACCIDENT (accidentInsurance)', value: 'accidentInsurance' },
  { name: 'SE_APARTMENT_BRF (condoInsuranceBrf)', value: 'condoInsuranceBrf' },
  { name: 'SE_APARTMENT_RENT (condoInsuranceRent)', value: 'condoInsuranceRent' },
  { name: 'SE_HOUSE (villaInsurance)', value: 'villaInsurance' },
  { name: 'SE_PET_CAT (catInsurance)', value: 'catInsurance' },
  { name: 'SE_PET_DOG (dogInsurance)', value: 'dogInsurance' },
]

export const SebLeadsDebuggerForm = () => {
  const [state, formAction] = useFormState(createSebLead, {
    fields: {
      ssn: '',
      firstName: 'John',
      lastName: 'Doe',
      email: 'John.Doe@gmail.com',
      phoneNumber: '+46707070707',
      product: PRODUCT_OPTIONS[2].value,
    },
  })

  return (
    <form action={formAction} className={yStack({ gap: 'xs' })}>
      <PersonalNumberField
        label="SSN"
        name={SEBFormElement.SSN}
        required={true}
        defaultValue={state?.fields?.[SEBFormElement.SSN]}
      />
      <TextField
        name={SEBFormElement.FirstName}
        type="text"
        label={SEBFormElement.FirstName}
        defaultValue={state?.fields?.[SEBFormElement.FirstName]}
        required={true}
      />
      <TextField
        type="text"
        label={SEBFormElement.LastName}
        name={SEBFormElement.LastName}
        required={true}
        defaultValue={state?.fields?.[SEBFormElement.LastName]}
      />
      <TextField
        type="text"
        label={SEBFormElement.Email}
        name={SEBFormElement.Email}
        required={true}
        defaultValue={state?.fields?.[SEBFormElement.Email]}
      />
      <TextField
        type="text"
        label={SEBFormElement.PhoneNumber}
        name={SEBFormElement.PhoneNumber}
        required={true}
        defaultValue={state?.fields?.[SEBFormElement.PhoneNumber]}
      />
      {/*
      TODO: select multiple values to be pushed to an array
          // multiple={true} looked bad
      */}
      <InputSelect
        name={SEBFormElement.Product}
        required={true}
        defaultValue={state?.fields?.[SEBFormElement.Product]}
        options={PRODUCT_OPTIONS}
      />
      <SubmitButton>Create SEB lead</SubmitButton>
      <ErrorMessages errors={state?.errors?.generic} />
      {state?.messages?.map((message, index) => (
        <Alert.Root key={index} variant={message.type}>
          <Alert.Message>{message.content}</Alert.Message>
        </Alert.Root>
      ))}
    </form>
  )
}
