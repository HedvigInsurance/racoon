import { InputStartDay } from '@/components/InputDay/InputStartDay'
import {
  type ProductOfferFragment,
  useCancellationRequestedUpdateMutation,
  useStartDateUpdateMutation,
  ExternalInsuranceCancellationOption,
} from '@/services/graphql/generated'
import { convertToDate, formatAPIDate } from '@/utils/date'
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

  const autoSwitchProps = {
    requested: props.offer.cancellation.requested,
    onAutoSwitchChange: handleAutoSwitchChange,
    companyName: props.offer.cancellation.externalInsurer?.displayName ?? 'Unknown',
  }

  switch (props.offer.cancellation.option) {
    case ExternalInsuranceCancellationOption.None:
      return (
        <InputStartDay
          date={startDate}
          onChange={handleChangeStartDate}
          loading={updateStartDateResult.loading}
        />
      )

    case ExternalInsuranceCancellationOption.Iex:
      return <IEXCancellation {...autoSwitchProps} {...startDateProps} />

    case ExternalInsuranceCancellationOption.Banksignering:
      return <BankSigneringCancellation {...autoSwitchProps} {...startDateProps} />

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
