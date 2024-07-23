import { useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'next-i18next'
import * as InputRadio from '@/components/PriceCalculator/InputRadio'
import {
  currentPriceIntentIdAtom,
  useRegistrationAddressAtomFamily,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { type UseRegistrationAddressField } from '@/services/PriceCalculator/Field.types'

type Props = {
  field: UseRegistrationAddressField
}

// Smart field that controls insurance data form autofill based on priceIntent.suggestedData
export function UseRegistrationAddressField({ field }: Props) {
  const { t } = useTranslation('purchase-form')
  const priceIntentId = useAtomValue(currentPriceIntentIdAtom)
  const [value, setValue] = useAtom(useRegistrationAddressAtomFamily(priceIntentId))
  const handleChange = (newValue: string) => {
    setValue(newValue === 'true')
  }
  return (
    <InputRadio.Root
      name={field.name}
      label={t('FIELD_USE_REGISTRATION_ADDRESS_LABEL')}
      required={true}
      defaultValue={String(value)}
      onValueChange={handleChange}
    >
      <InputRadio.Item key={`${field.name}-true`} label={t('LABEL_YES')} value="true" />
      <InputRadio.Item key={`${field.name}-false`} label={t('LABEL_NO')} value="false" />
    </InputRadio.Root>
  )
}
