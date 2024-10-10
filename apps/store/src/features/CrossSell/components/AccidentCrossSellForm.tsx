import { datadogLogs } from '@datadog/browser-logs'
import { isSameDay } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { type FormEvent, type ReactNode, useState } from 'react'
import { yStack } from 'ui'
import { InputDay } from '@/components/InputDay/InputDay'
import { TotalPrice } from '@/components/ProductCard/TotalPrice/TotalPrice'
import { StepperInput } from '@/components/StepperInput/StepperInput'
import { type OfferRecommendationFragment } from '@/services/graphql/generated'
import { useShopSessionIdOrThrow } from '@/services/shopSession/ShopSessionContext'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { AccidentCrossSellFormFields } from '../CrossSell.constants'
import { useAddRecommendationOfferToCart } from '../hooks/useAddRecommendationOfferToCart'
import { useGetNewOffer } from '../hooks/useGetNewOffer'
import { useUpdateOfferStartDate } from '../hooks/useUpdateOfferStartDate'
import {
  getFormValues,
  getOfferNumberCoInsuredWithFallback,
  getOfferStartDateWithFallback,
} from '../utils'

type ChildrenParams = {
  isCoInsuredUpdated: boolean
  isPending: boolean
}

type Props = {
  offer: OfferRecommendationFragment
  children: ({ isCoInsuredUpdated, isPending }: ChildrenParams) => ReactNode
}

export function AccidentCrossSellForm({ offer: initialOffer, children }: Props) {
  const { t } = useTranslation('cart')

  const shopSessionId = useShopSessionIdOrThrow()

  const [offer, setOffer] = useState(initialOffer)
  const [isPending, setIsPending] = useState(false)

  const updateOfferStartDate = useUpdateOfferStartDate()

  const getNewOffer = useGetNewOffer({
    shopSessionId,
    productName: offer.product.name,
  })

  const [addOfferToCart] = useAddRecommendationOfferToCart({ shopSessionId })

  const defaultCoInsuredNumber = getOfferNumberCoInsuredWithFallback(offer)

  const [isCoInsuredUpdated, setIsCoInsuredUpdated] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const formValues = getFormValues(formData)

    const hasStartDateChanged = !isSameDay(
      formValues[AccidentCrossSellFormFields.START_DATE],
      getOfferStartDateWithFallback(offer),
    )

    let updatedOffer = offer

    try {
      if (hasStartDateChanged) {
        updatedOffer = await updateOfferStartDate(
          updatedOffer.id,
          formValues[AccidentCrossSellFormFields.START_DATE],
        )
      }

      if (formValues[AccidentCrossSellFormFields.INTENT] === 'update-price') {
        updatedOffer = await getNewOffer({
          numberCoInsured: formValues[AccidentCrossSellFormFields.NUMBER_CO_INSURED],
        })

        setOffer(updatedOffer)
        setIsCoInsuredUpdated(false)
      }

      if (formValues[AccidentCrossSellFormFields.INTENT] === 'add-offer') {
        await addOfferToCart(updatedOffer)
      }
    } catch (error) {
      datadogLogs.logger.error('Cross sell | failed to update offer', { error })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form className={yStack({ gap: 'md' })} onSubmit={handleSubmit}>
      <div className={yStack({ gap: 'xxs' })}>
        <StepperInput
          name={AccidentCrossSellFormFields.NUMBER_CO_INSURED}
          min={0}
          max={5}
          label={t('NUMBER_COINSURED_INPUT_LABEL')}
          optionLabel={(count) => t('NUMBER_COINSURED_OPTION_LABEL', { count })}
          defaultValue={defaultCoInsuredNumber}
          onChange={(value) => setIsCoInsuredUpdated(value !== defaultCoInsuredNumber)}
          required={true}
        />
        <InputDay
          name={AccidentCrossSellFormFields.START_DATE}
          label={t('START_DATE_LABEL')}
          fromDate={new Date()}
          defaultSelected={getOfferStartDateWithFallback(offer)}
          required={true}
        />
        <input
          type="hidden"
          name={AccidentCrossSellFormFields.INTENT}
          value={isCoInsuredUpdated ? 'update-price' : 'add-offer'}
          readOnly
        />
      </div>

      <TotalPrice {...getOfferPrice(offer.cost)} label={t('YOUR_PRICE', { ns: 'common' })} />

      {children({ isCoInsuredUpdated, isPending })}
    </form>
  )
}
