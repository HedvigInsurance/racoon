import { storyblokEditable } from '@storyblok/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CurrencyCode } from '@/services/apollo/generated'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { LoadingSkeleton } from './LoadingSkeleton'
import { TrialExtensionForm } from './TrialExtensionForm'

type Props = SbBaseBlockProps<{
  requirePaymentConnection?: boolean
}>

export const CarTrialExtensionBlock = (props: Props) => {
  const data = useCarTrialQuery()

  if (!data) return <LoadingSkeleton {...storyblokEditable(props.blok)} />

  return <TrialExtensionForm {...storyblokEditable(props.blok)} contract={data.trialContract} />
}
CarTrialExtensionBlock.blockName = 'carTrialExtension'

const CAR_TRIAL_DATA_QUERY = {
  id: '123',

  trialContract: {
    id: '1234',

    premium: {
      amount: 299,
      currencyCode: CurrencyCode.Sek,
    },

    terminationDate: '2023-12-31',

    exposure: {
      displayNameFull: 'Volkswagen Polo · LPP 083',
    },

    variant: {
      displayName: 'Full insurance',

      displayItems: [
        {
          displayTitle: 'Address',
          displayValue: 'Hedvigsgatan 11',
        },
      ],
    },
  },

  priceIntent: {
    id: '12345',
    data: { mileage: 1500 },
    offers: [
      {
        id: '123456',
        variant: {
          displayName: 'Full insurance',
          typeOfContract: 'SE_CAR_FULL',
        },
      },
      {
        id: '1234567',
        variant: {
          displayName: 'Half insurance',
          typeOfContract: 'SE_CAR_HALF',
        },
      },
      {
        id: '12345678',
        variant: {
          displayName: 'Traffic insurance',
          typeOfContract: 'SE_CAR_TRAFFIC',
        },
      },
    ],
    defaultOffer: {
      id: '123456',
      cost: { net: { amount: 579, currencyCode: CurrencyCode.Sek } },
      displayItems: [
        {
          displayTitle: 'Address',
          displayValue: 'Hedvigsgatan 11',
        },
      ],
      startDate: '2023-12-31',
      variant: {
        documents: [],

        product: {
          displayNameShort: 'Car insurance',
        },
      },
    },
  },
} as const

type CarTrialData = typeof CAR_TRIAL_DATA_QUERY

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
