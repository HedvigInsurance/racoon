import { useTranslation } from 'next-i18next'
import { ToggleCard, yStack } from 'ui'
import { InputStartDay } from '@/components/InputDay/InputStartDay'
import {
  type ProductOfferFragment,
  useCancellationRequestedUpdateMutation,
  useStartDateUpdateMutation,
} from '@/services/graphql/generated'
import { convertToDate, formatAPIDate } from '@/utils/date'
import { useOptimisticValue } from '@/utils/useOptimisticValue'

type Props = {
  offerId: string
  startDate?: Date
  cancellation: ProductOfferFragment['cancellation']
}

export function CartItemInsuranceSwitcher({ cancellation, offerId, startDate }: Props) {
  const { t } = useTranslation('purchase-form')

  const [isChecked, setIsChecked, revertToOriginalChecked] = useOptimisticValue(
    cancellation.requested,
  )

  const [updateSwitchingRequest, updateSwitchingResult] = useCancellationRequestedUpdateMutation()
  const [updateStartDate, updateStartDateResult] = useStartDateUpdateMutation()

  const handleAutoSwitchChange = async (checked: boolean) => {
    setIsChecked(!isChecked)

    await updateSwitchingRequest({
      variables: { productOfferIds: offerId, requested: checked },
      onError: () => revertToOriginalChecked(),
    })
  }

  const handleChangeStartDate = (date: Date) => {
    updateStartDate({
      variables: {
        productOfferIds: offerId,
        startDate: formatAPIDate(date),
      },
    })
  }

  const insuranceStartDate = convertToDate(startDate) ?? undefined

  if (!cancellation.externalInsurer) {
    return null
  }

  return (
    <div className={yStack({ gap: 'xxs' })}>
      <ToggleCard.Root>
        <ToggleCard.Label>{t('AUTO_SWITCH_FIELD_LABEL')}</ToggleCard.Label>
        <ToggleCard.Switch checked={isChecked} onCheckedChange={handleAutoSwitchChange} />
        <ToggleCard.Description>
          {t('AUTO_SWITCH_FIELD_MESSAGE', {
            COMPANY: cancellation.externalInsurer.displayName,
          })}
        </ToggleCard.Description>
      </ToggleCard.Root>

      {!isChecked ? (
        <InputStartDay
          date={insuranceStartDate}
          onChange={handleChangeStartDate}
          loading={updateStartDateResult.loading || updateSwitchingResult.loading}
        />
      ) : null}
    </div>
  )
}
