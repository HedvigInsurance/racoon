import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useState } from 'react'
import { theme } from 'ui'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ActionButton } from '../../components/ProductItem/ProductItem'
import { ActionStateEdit } from './ActionStateEdit'
import { RemoveCarOfferActionButton } from './RemoveCarOfferActionButton'
import { useEditAndConfirm } from './useEditAndConfirm'

type State = 'IDLE' | 'EDITING'

type Offer = Pick<ProductOfferFragment, 'id'> & {
  variant: Pick<ProductOfferFragment['variant'], 'typeOfContract' | 'displayName'>
}

type Props = {
  priceIntent: Pick<PriceIntent, 'id' | 'data'> & { offers: Array<Offer> }
  offer: Offer

  onUpdateOffer: (offer: Offer | null) => void
  onRemove: () => void
}

export const ActionButtonsCar = (props: Props) => {
  const [state, setState] = useState<State>('IDLE')

  const [editAndConfirm, loading] = useEditAndConfirm({
    priceIntentId: props.priceIntent.id,

    onCompleted(priceIntent) {
      const newOffer = priceIntent.offers.find(
        (offer) => offer.variant.typeOfContract === props.offer.variant.typeOfContract,
      )
      props.onUpdateOffer(newOffer ?? null)
      setState('IDLE')
    },
  })

  const handleClickEdit = () => {
    datadogRum.addAction('Offer Car Edit')
    setState('EDITING')
  }

  const handleClickRemove = () => {
    datadogRum.addAction('Offer Car Remove')
    props.onRemove()
  }

  if (state === 'EDITING') {
    const handleCancel = () => setState('IDLE')

    const handleSave = (option: string, data: Record<string, unknown>) => {
      const newOffer = props.priceIntent.offers.find((offer) => offer.id === option)
      if (newOffer && newOffer.id !== props.offer.id) {
        props.onUpdateOffer(newOffer)
      }
      editAndConfirm(data)
    }

    const options = props.priceIntent.offers.map((offer) => ({
      name: offer.variant.displayName,
      value: offer.id,
    }))

    return (
      <ActionStateEdit
        options={options}
        onSave={handleSave}
        onCancel={handleCancel}
        loading={loading}
        data={props.priceIntent.data}
      />
    )
  }

  return (
    <ButtonWrapper>
      <ActionButton onClick={handleClickEdit}>Edit</ActionButton>
      <RemoveCarOfferActionButton onConfirm={handleClickRemove} />
    </ButtonWrapper>
  )
}

const ButtonWrapper = styled.div({
  display: 'grid',
  gridAutoFlow: 'column',
  gap: theme.space.xs,
})
