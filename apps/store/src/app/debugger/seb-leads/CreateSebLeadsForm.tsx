'use client'

import { useFormState } from 'react-dom'
import { yStack } from 'ui'
import { FormResults } from '@/app/debugger/seb-leads/FormResults'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { TextField } from '@/components/TextField/TextField'
import { SebDebuggerFormElement } from './constants'
import { createSebLead } from './createSebLead'

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
        name={SebDebuggerFormElement.SSN}
        required={true}
        defaultValue={state?.fields?.[SebDebuggerFormElement.SSN]}
      />
      <TextField
        name={SebDebuggerFormElement.FirstName}
        label={SebDebuggerFormElement.FirstName}
        defaultValue={state?.fields?.[SebDebuggerFormElement.FirstName]}
        required={true}
      />
      <TextField
        label={SebDebuggerFormElement.LastName}
        name={SebDebuggerFormElement.LastName}
        required={true}
        defaultValue={state?.fields?.[SebDebuggerFormElement.LastName]}
      />
      <TextField
        label={SebDebuggerFormElement.Email}
        name={SebDebuggerFormElement.Email}
        required={true}
        defaultValue={state?.fields?.[SebDebuggerFormElement.Email]}
      />
      <TextField
        label={SebDebuggerFormElement.PhoneNumber}
        name={SebDebuggerFormElement.PhoneNumber}
        required={true}
        defaultValue={state?.fields?.[SebDebuggerFormElement.PhoneNumber]}
      />
      {/*
      TODO: select multiple values to be pushed to an array
          // multiple={true} looked bad
      */}
      <InputSelect
        name={SebDebuggerFormElement.Product}
        required={true}
        defaultValue={state?.fields?.[SebDebuggerFormElement.Product]}
        options={PRODUCT_OPTIONS}
      />
      <SubmitButton>Create SEB lead</SubmitButton>
      <FormResults formState={state} />
    </form>
  )
}
