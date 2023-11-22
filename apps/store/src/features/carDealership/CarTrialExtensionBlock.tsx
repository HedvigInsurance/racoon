import { type QueryHookOptions } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { storyblokEditable } from '@storyblok/react'
import addDays from 'date-fns/addDays'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { Space } from 'ui'
import { useGlobalBanner } from '@/components/GlobalBanner/useGlobalBanner'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useCarTrialExtensionQuery } from '@/services/apollo/generated'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { CarTrialExtension, TrialContract } from './carDealership.types'
import { useUserWantsExtension } from './ExtensionOfferToggle'
import { LoadingSkeleton } from './LoadingSkeleton'
import { PayForTrial } from './PayForTrial'
import { TrialExtensionForm } from './TrialExtensionForm'

// We cancel the trial after 28 days if member hasn't connected payment
const DAYS_UNTIL_TERMINATION = 28

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

  const trialContact: TrialContract | null = useMemo(() => {
    if (data?.carTrial) {
      return {
        ...data.carTrial.trialContract,
        pillowSrc: data.carTrial.priceIntent.product.pillowImage.src,
      }
    }

    return null
  }, [data])

  return (
    <GridLayout.Root>
      <GridLayout.Content width="1/3" align="center">
        {!data?.carTrial || !trialContact ? (
          <LoadingSkeleton />
        ) : (
          <Space y={1.5}>
            {userWantsExtension ? (
              <TrialExtensionForm
                {...storyblokEditable(props.blok)}
                trialContract={trialContact}
                priceIntent={data.carTrial.priceIntent}
                shopSession={data.carTrial.shopSession}
                requirePaymentConnection={props.blok.requirePaymentConnection ?? false}
              />
            ) : (
              <PayForTrial
                trialContract={trialContact}
                shopSessionId={data.carTrial.shopSession.id}
                defaultOffer={data.carTrial.priceIntent.defaultOffer ?? undefined}
                ssn={data.carTrial.shopSession.customer?.ssn ?? undefined}
              />
            )}
          </Space>
        )}
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
CarTrialExtensionBlock.blockName = 'carTrialExtension'

type UseCarTrialQueryParams = Pick<QueryHookOptions<NonNullable<CarTrialExtension>>, 'onCompleted'>

const useCarTrialQuery = (params: UseCarTrialQueryParams) => {
  const router = useRouter()
  const queryParam = router.query['contractId']
  const contractId = typeof queryParam === 'string' ? queryParam : undefined

  const { data } = useCarTrialExtensionQuery({
    variables: contractId ? { contractId } : undefined,
    skip: !contractId,
    onCompleted(data) {
      const { carTrial } = data
      if (!carTrial) return
      params.onCompleted?.(carTrial)
    },
    onError(error) {
      datadogLogs.logger.warn('Car dealership | Failed to load trial data', {
        name: error.name,
        message: error.message,
      })
      router.push(PageLink.fourOhFour().pathname)
    },
  })

  return data
}

type AddNotificationBannerOptions = {
  data: NonNullable<CarTrialExtension>
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
        const dueDate = addDays(today, DAYS_UNTIL_TERMINATION)

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
