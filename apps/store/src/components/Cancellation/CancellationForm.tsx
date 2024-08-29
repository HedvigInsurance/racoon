import { useTranslation } from 'next-i18next'
import { InputStartDay } from '@/components/InputDay/InputStartDay'
import {
  type ProductOfferFragment,
  useCancellationRequestedUpdateMutation,
  useStartDateUpdateMutation,
  ExternalInsuranceCancellationOption,
} from '@/services/graphql/generated'
import { convertToDate, formatAPIDate } from '@/utils/date'
import { InfoCard } from '../InfoCard/InfoCard'
import { BankSigneringCancellation } from './BankSigneringCancellation'
import { BankSigneringInvalidRenewalDateCancellation } from './BankSigneringInvalidRenewalDateCancellation'
import { IEXCancellation } from './IEXCancellation'

type Props = {
  productOfferIds: Array<string>
  offer: ProductOfferFragment
}

export const CancellationForm = (props: Props) => {
  const [mutate] = useCancellationRequestedUpdateMutation()
  const handleAutoSwitchChange = (checked: boolean) => {
    mutate({ variables: { productOfferIds: props.productOfferIds, requested: checked } })
  }

  const startDate = convertToDate(props.offer.startDate) ?? undefined
  const { t } = useTranslation('purchase-form')

  const [updateStartDate, updateStartDateResult] = useStartDateUpdateMutation()
  const handleChangeStartDate = (date: Date) => {
    updateStartDate({
      variables: {
        productOfferIds: props.productOfferIds,
        startDate: formatAPIDate(date),
      },
    })
  }

  const startDateProps = {
    startDate,
    onStartDateChange: handleChangeStartDate,
    loading: updateStartDateResult.loading,
  }

  const switcherCompanyName = props.offer.cancellation.externalInsurer?.displayName

  const autoSwitchProps = {
    requested: props.offer.cancellation.requested,
    onAutoSwitchChange: handleAutoSwitchChange,
    companyName: switcherCompanyName ?? 'Unknown',
  }

  // TODO: Remove when all switchable products have priceIntent.notification. For now only car uses it
  const shouldShowManualSwitchingNote =
    props.offer.product.name !== 'SE_CAR' && switcherCompanyName != null

  switch (props.offer.cancellation.option) {
    case ExternalInsuranceCancellationOption.None:
      return (
        <>
          {shouldShowManualSwitchingNote && (
            <InfoCard>{t('MANUAL_SWITCH_INFO', { COMPANY_NAME: switcherCompanyName })}</InfoCard>
          )}

          <InputStartDay
            date={startDate}
            onChange={handleChangeStartDate}
            loading={updateStartDateResult.loading}
          />
        </>
      )

    case ExternalInsuranceCancellationOption.Iex:
      return <IEXCancellation {...autoSwitchProps} {...startDateProps} />

    // TODO: Remove when no longer supported for new purchases and old sessions have expired
    case ExternalInsuranceCancellationOption.Banksignering:
      return <BankSigneringCancellation {...autoSwitchProps} {...startDateProps} />

    // TODO: Remove when no longer supported for new purchases and old sessions have expired
    case ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate:
      if (startDateProps.startDate === undefined) {
        throw new Error('Cancellation | Missing start date')
      }

      return (
        <BankSigneringInvalidRenewalDateCancellation
          {...startDateProps}
          startDate={startDateProps.startDate}
        />
      )
  }
}
