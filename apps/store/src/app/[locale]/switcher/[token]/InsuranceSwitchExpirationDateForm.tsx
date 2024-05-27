'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { useFormState } from 'react-dom'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { CheckIcon, Space, Text } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { ErrorMessages } from '@/components/FormErrors/ErrorMessages'
import { InputDay } from '@/components/InputDay/InputDay'
import {
  checkboxIndicator,
  checkboxRoot,
  consentWrapper,
} from '@/features/carDealership/MyMoneyConsent/MyMoneyConsent.css'
import { wrapper } from './InsuranceSwitcherExpirationDateForm.css'
import { submitSwitchConfirmation } from './submitSwitchConfirmation'

type Props = {
  switchToken: string
}

export default function InsuranceSwitchExpirationDateForm({ switchToken }: Props) {
  const [state, formAction] = useFormState(submitSwitchConfirmation, null)

  return (
    <div className={clsx(wrapper, sprinkles({ py: 'xxxl' }))}>
      <Text className={sprinkles({ mb: 'md' })}>
        Please enter expiration date and check the box below to confirm cancellation.
      </Text>
      <form action={formAction}>
        <Space y={0.25}>
          <InputDay name="expiryDate" label="Expiry Date" required={true} />

          <div className={consentWrapper}>
            <Checkbox.Root id="confirmation" name="confirmation" className={checkboxRoot} required>
              <Checkbox.Indicator className={checkboxIndicator}>
                <CheckIcon size="1rem" />
              </Checkbox.Indicator>
            </Checkbox.Root>

            <Text size="md">
              <label htmlFor="confirmation">
                I confirm we have cancelled the insurance on our side.
              </label>
            </Text>
          </div>

          <input type="text" name="token" value={switchToken} hidden />

          <SubmitButton>Submit expiration date</SubmitButton>
          <ErrorMessages errors={state?.errors?.generic} />
        </Space>
      </form>
    </div>
  )
}
