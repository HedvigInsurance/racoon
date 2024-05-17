'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { useActionState } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Badge, CheckIcon, Space, Text } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { InputDay } from '@/components/InputDay/InputDay'
import {
  checkboxIndicator,
  checkboxRoot,
  consentWrapper,
} from '@/features/carDealership/MyMoneyConsent/MyMoneyConsent.css'
// eslint-disable-next-line import/order
import { type FormStateWithErrors } from 'app/types/formStateTypes'
import { wrapper } from './InsuranceSwitcherExpirationDateForm.css'

type Props = {
  switchToken: string
}

export default function InsuranceSwitchExpirationDateForm({ switchToken }: Props) {
  const [, formAction] = useActionState((_: FormStateWithErrors, formData: FormData) => {
    const expiryDate = formData.get('expiryDate')

    console.log(expiryDate)

    return null
  }, null)

  return (
    <div className={clsx(wrapper, sprinkles({ py: 'xxxl' }))}>
      <Text className={sprinkles({ mb: 'md' })}>
        Please enter expiration date related to agreement number
        <Badge as="span" className={sprinkles({ marginLeft: 'xxs' })}>
          {switchToken}
        </Badge>
      </Text>
      <form action={formAction}>
        <Space y={0.25}>
          <InputDay name="expiryDate" label="Expiry Date" required={true} />

          <div className={consentWrapper}>
            <Checkbox.Root id="myMoneyConsent" className={checkboxRoot}>
              <Checkbox.Indicator className={checkboxIndicator}>
                <CheckIcon size="1rem" />
              </Checkbox.Indicator>
            </Checkbox.Root>

            <Text size="md">
              <label htmlFor="myMoneyConsent">
                I confirm we have cancelled the insurance on our side.
              </label>
            </Text>
          </div>

          <SubmitButton>Submit expiration date</SubmitButton>
        </Space>
      </form>
    </div>
  )
}
