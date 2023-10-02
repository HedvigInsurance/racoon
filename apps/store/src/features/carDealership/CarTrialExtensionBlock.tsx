import { type QueryHookOptions } from '@apollo/client'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useGlobalBanner } from '@/components/GlobalBanner/useGlobalBanner'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useCarTrialExtensionQuery, type CarTrialExtensionQuery } from '@/services/apollo/generated'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useFormatter } from '@/utils/useFormatter'
import { CAR_TRIAL_DATA_QUERY, type TrialExtension } from './carDealershipFixtures'
import { LoadingSkeleton } from './LoadingSkeleton'
import { TrialExtensionForm } from './TrialExtensionForm'

const FOURTEEN_DAYS = 14

type Props = SbBaseBlockProps<{
  requirePaymentConnection?: boolean
}>

export const CarTrialExtensionBlock = (props: Props) => {
  const { dateFull } = useFormatter()
  const { addBanner } = useGlobalBanner()
  const { t } = useTranslation('cart')

  const data = useCarTrialQuery({
    onCompleted(data) {
      const requirePaymentConnection = props.blok.requirePaymentConnection ?? false

      if (requirePaymentConnection) {
        const today = new Date()
        const dueDate = new Date(data.trialContract.startDate)
        dueDate.setDate(dueDate.getDate() + FOURTEEN_DAYS)

        if (today <= dueDate) {
          addBanner(t('CONNECT_PAYMENT_BANNER', { dueDate: `<b>${dateFull(dueDate)}</b>` }), 'info')
        }
      } else {
        addBanner(
          t('REMAIN_INSURED_BANNER', {
            dueDate: `<b>${dateFull(new Date(data.trialContract.terminationDate))}</b>`,
          }),
          'warning',
        )
      }
    },
  })

  return (
    <GridLayout.Root>
      <GridLayout.Content width="1/3" align="center">
        {data ? (
          <TrialExtensionForm
            {...storyblokEditable(props.blok)}
            contract={data.trialContract}
            priceIntent={data.priceIntent}
            shopSession={data.shopSession}
            requirePaymentConnection={props.blok.requirePaymentConnection ?? false}
          />
        ) : (
          <LoadingSkeleton />
        )}
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
CarTrialExtensionBlock.blockName = 'carTrialExtension'

type UseCarTrialQueryParams = Pick<QueryHookOptions<TrialExtension>, 'onCompleted'>

const useCarTrialQuery = (params: UseCarTrialQueryParams) => {
  const router = useRouter()
  const queryParam = router.query['id']
  const shopSessionId = typeof queryParam === 'string' ? queryParam : undefined

  const { data } = useCarTrialExtensionQuery({
    variables: shopSessionId ? { shopSessionId: shopSessionId } : undefined,
    skip: !shopSessionId,
    onCompleted(data) {
      params.onCompleted?.(getTrialExtension(data))
    },
  })

  if (data) {
    return getTrialExtension(data)
  }

  return null
}

// TODO: we're gonna be able to remove this when API is complete
const getTrialExtension = (data: CarTrialExtensionQuery): TrialExtension => {
  return {
    ...CAR_TRIAL_DATA_QUERY,
    shopSession: data.shopSession,
    priceIntent: data.shopSession.priceIntents[0],
  }
}
