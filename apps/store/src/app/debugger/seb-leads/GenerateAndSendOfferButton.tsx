'use client'
import { useFormState } from 'react-dom'
import { yStack } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { FormResults } from './FormResults'
import {generateAndSendOffer} from './generateAndSendOffer'

export function GenerateAndSendOfferButton() {
  const [state, formAction] = useFormState(generateAndSendOffer, {})
  return (
    <form className={yStack({ gap: 'xs' })} action={formAction}>
      <SubmitButton>Generate and fend offer</SubmitButton>
      <FormResults formState={state} />
    </form>
  )
}
