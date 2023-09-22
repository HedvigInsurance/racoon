import { storyblokEditable } from '@storyblok/react'
import { useRouter } from 'next/router'
import { useCarTrialExtensionQuery } from '@/services/apollo/generated'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { CAR_TRIAL_DATA_QUERY, type TrialExtension } from './carDealershipFixtures'
import { LoadingSkeleton } from './LoadingSkeleton'
import { TrialExtensionForm } from './TrialExtensionForm'

type Props = SbBaseBlockProps<{
  requirePaymentConnection?: boolean
}>

export const CarTrialExtensionBlock = (props: Props) => {
  const data = useCarTrialQuery()

  if (!data) return <LoadingSkeleton {...storyblokEditable(props.blok)} />

  return (
    <TrialExtensionForm
      {...storyblokEditable(props.blok)}
      contract={data.trialContract}
      priceIntent={data.priceIntent}
      shopSession={data.shopSession}
      requirePaymentConnection={props.blok.requirePaymentConnection ?? false}
    />
  )
}
CarTrialExtensionBlock.blockName = 'carTrialExtension'

const useCarTrialQuery = () => {
  const router = useRouter()
  const queryParam = router.query['id']
  const id = typeof queryParam === 'string' ? queryParam : undefined

  const { data: carTrialExtensionData } = useCarTrialExtensionQuery({
    variables: id ? { shopSessionId: id } : undefined,
    skip: !id,
  })

  if (carTrialExtensionData) {
    const data: TrialExtension = {
      ...CAR_TRIAL_DATA_QUERY,
      shopSession: carTrialExtensionData.shopSession,
      priceIntent: carTrialExtensionData.shopSession.priceIntents[0],
    }

    return data
  }

  return null
}
