import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { ActionButton } from '@/components/ProductItem/ProductItem'
import type { PriceIntentFragment } from '@/services/graphql/generated'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { getOffersByPrice } from '@/utils/getOffersByPrice'
import { EditExtensionOfferForm } from '../EditExtensionOfferForm'
import { useEditAndConfirm } from '../useEditAndConfirm'

type State = { type: 'IDLE' } | { type: 'EDITING' } | { type: 'SUBMITTING'; tierLevel?: string }

const STATE: Record<Exclude<State['type'], 'SUBMITTING'>, State> = {
  IDLE: { type: 'IDLE' },
  EDITING: { type: 'EDITING' },
}

type Offer = Pick<ProductOfferFragment, 'id' | 'cost'> & {
  variant: Pick<ProductOfferFragment['variant'], 'typeOfContract' | 'displayName'>
}

type Props = {
  priceIntent: PriceIntentFragment
  offer: Offer
  onUpdate: (tierLevel: string) => void
}

export const EditActionButton = (props: Props) => {
  const { t } = useTranslation('carDealership')
  const [state, setState] = useState<State>(STATE.IDLE)

  const [editAndConfirm, loading] = useEditAndConfirm({
    priceIntentId: props.priceIntent.id,

    onCompleted() {
      if (state.type === 'SUBMITTING' && state.tierLevel) {
        props.onUpdate(state.tierLevel)
      }

      setState(STATE.IDLE)
    },
  })

  const handleClickEdit = () => {
    datadogRum.addAction('Offer Car Edit')
    setState(STATE.EDITING)
  }

  if (state.type === 'EDITING' || state.type === 'SUBMITTING') {
    const handleCancel = () => setState(STATE.IDLE)

    const handleSave = (tierLevel: string, data: Record<string, unknown>) => {
      setState({
        type: 'SUBMITTING',
        tierLevel: tierLevel !== props.offer.variant.typeOfContract ? tierLevel : undefined,
      })

      editAndConfirm(data)
    }

    const sortedOffers = getOffersByPrice(props.priceIntent.offers)
    const options = sortedOffers.map((offer) => ({
      name: offer.variant.displayName,
      value: offer.variant.typeOfContract,
    }))

    return (
      <EditExtensionOfferForm
        tierLevelOptions={options}
        defaultTierLevel={props.offer.variant.typeOfContract}
        onSave={handleSave}
        onCancel={handleCancel}
        loading={loading}
        data={props.priceIntent.data}
      />
    )
  }

  return (
    <ActionButton variant="secondary-alt" onClick={handleClickEdit}>
      {t('EDIT_CAR_TRIAL_EXTENSION_BUTTON')}
    </ActionButton>
  )
}
