import { storyblokEditable } from '@storyblok/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { CAR_TRIAL_DATA_QUERY, CarTrialData } from './carDealershipFixtures'
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
    />
  )
}
CarTrialExtensionBlock.blockName = 'carTrialExtension'

const useCarTrialQuery = () => {
  const router = useRouter()
  const queryParam = router.query['id']
  const id = typeof queryParam === 'string' ? queryParam : undefined

  const [data, setData] = useState<CarTrialData>()

  useEffect(() => {
    // if (!id) return
    if (!router.isReady) return

    const handle = setTimeout(() => {
      setData(CAR_TRIAL_DATA_QUERY)
    }, 1000)

    return () => clearTimeout(handle)
  }, [router.isReady, id])

  return data
}
