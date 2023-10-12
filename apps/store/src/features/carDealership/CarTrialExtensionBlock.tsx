import { type QueryHookOptions } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { storyblokEditable } from '@storyblok/react'
import addDays from 'date-fns/addDays'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useGlobalBanner } from '@/components/GlobalBanner/useGlobalBanner'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useCarTrialExtensionQuery, type CarTrialExtensionQuery } from '@/services/apollo/generated'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { CAR_TRIAL_DATA_QUERY, type TrialExtension } from './carDealershipFixtures'
import { useUserWantsExtension } from './ExtensionOfferToggle'
import { LoadingSkeleton } from './LoadingSkeleton'
import { PayForTrial } from './PayForTrial'
import { TrialExtensionForm } from './TrialExtensionForm'

const FOURTEEN_DAYS = 14

type Props = SbBaseBlockProps<{
  requirePaymentConnection?: boolean
}>

export const CarTrialExtensionBlock = (props: Props) => {
  const userWantsExtension = useUserWantsExtension()
  const addNotificationBanner = useAddNotificationBanner()

  const data = useCarTrialQuery({
    onCompleted(data) {
      addNotificationBanner({ data, requirePaymentConnection: props.blok.requirePaymentConnection })
    },
  })

  return (
    <GridLayout.Root>
      <GridLayout.Content width="1/3" align="center">
        {!data && <LoadingSkeleton />}

        {data && userWantsExtension && (
          <TrialExtensionForm
            {...storyblokEditable(props.blok)}
            contract={data.trialContract}
            priceIntent={data.priceIntent}
            shopSession={data.shopSession}
            requirePaymentConnection={props.blok.requirePaymentConnection ?? false}
          />
        )}

        {data && !userWantsExtension && (
          <PayForTrial contract={data.trialContract} ssn={data.ssn} />
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
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
    onCompleted(data) {
      params.onCompleted?.(getTrialExtension(data))
    },
    onError(error) {
      datadogLogs.logger.warn('Car dealership | Failed to load trial data', {
        name: error.name,
        message: error.message,
      })
      router.push(PageLink.fourOhFour())
    },
  })

  if (data) {
    return getTrialExtension(data)
  }

  return null
}

type AddNotificationBannerOptions = {
  data: TrialExtension
  requirePaymentConnection?: boolean
}

const useAddNotificationBanner = () => {
  const { addBanner } = useGlobalBanner()
  const { dateFull } = useFormatter()
  const { t } = useTranslation('carDealership')

  const addNotificationBanner = useCallback(
    ({ data, requirePaymentConnection = false }: AddNotificationBannerOptions) => {
      if (requirePaymentConnection) {
        const today = new Date()
        const dueDate = addDays(today, FOURTEEN_DAYS)

        if (today <= dueDate) {
          addBanner(
            t('CONNECT_PAYMENT_BANNER', { dueDate: `<b>${dateFull(dueDate)}</b>` }),
            'info',
            {
              force: true,
            },
          )
        }
      } else {
        addBanner(
          t('REMAIN_INSURED_BANNER', {
            dueDate: `<b>${dateFull(new Date(data.trialContract.terminationDate))}</b>`,
          }),
          'warning',
          { force: true },
        )
      }
    },
    [addBanner, dateFull, t],
  )

  return addNotificationBanner
}

// TODO: we're gonna be able to remove this when API is complete
const getTrialExtension = (data: CarTrialExtensionQuery): TrialExtension => {
  const ssn = data.shopSession.customer?.ssn
  if (!ssn) throw new Error('Car dealership | No SSN in Shop Session')

  return {
    ...CAR_TRIAL_DATA_QUERY,
    shopSession: data.shopSession,
    priceIntent: data.shopSession.priceIntents[0],
    ssn,
  }
}
