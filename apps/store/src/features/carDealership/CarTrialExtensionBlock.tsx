'use client'

import { type QueryHookOptions } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { storyblokEditable } from '@storyblok/react'
import { addDays } from 'date-fns'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useCallback, useMemo } from 'react'
import { Space } from 'ui'
import { useSetGlobalBanner } from '@/components/GlobalBanner/globalBannerState'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { CarDealershipBanners } from '@/features/carDealership/carDearlership.constants'
import { useCarTrialExtensionQuery } from '@/services/graphql/generated'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import type { CarTrialExtension, TrialContract } from './carDealership.types'
import { useUserWantsExtension } from './ExtensionOfferToggle'
import { LoadingSkeleton } from './LoadingSkeleton'
import { PayForTrial } from './PayForTrial'
import { TrialExtensionForm } from './TrialExtensionForm/TrialExtensionForm'

// We cancel the trial if member hasn't connected payment
const DAYS_UNTIL_TERMINATION = 14

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

type UseCarTrialQueryParams = Pick<QueryHookOptions<NonNullable<CarTrialExtension>>, 'onCompleted'>

const useCarTrialQuery = (params: UseCarTrialQueryParams) => {
  const router = useRouter()
  const queryParam = router.query['contractId']
  const locale = useRoutingLocale()

  let contractId = undefined
  if (typeof queryParam === 'string') {
    contractId = queryParam
  } else if (Array.isArray(queryParam)) {
    contractId = queryParam[0]
  }

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
      router.push(PageLink.fourOhFour({ locale }).pathname)
    },
  })

  return data
}

type AddNotificationBannerOptions = {
  data: NonNullable<CarTrialExtension>
  requirePaymentConnection?: boolean
}

const useAddNotificationBanner = () => {
  const setGlobalBanner = useSetGlobalBanner()
  const { dateFull } = useFormatter()
  const { t } = useTranslation('carDealership')

  const addNotificationBanner = useCallback(
    ({ data, requirePaymentConnection = false }: AddNotificationBannerOptions) => {
      if (requirePaymentConnection) {
        const today = new Date()
        const dueDate = addDays(today, DAYS_UNTIL_TERMINATION)

        if (today <= dueDate) {
          setGlobalBanner(
            {
              id: CarDealershipBanners.ConnectPayment,
              content: t('CONNECT_PAYMENT_BANNER', { dueDate: `<b>${dateFull(dueDate)}</b>` }),
              variant: 'info',
            },
            {
              force: true,
            },
          )
        }
      } else {
        setGlobalBanner(
          {
            id: CarDealershipBanners.Extend,
            content: t('REMAIN_INSURED_BANNER', {
              dueDate: `<b>${dateFull(new Date(data.trialContract.terminationDate))}</b>`,
            }),
            variant: 'warning',
          },
          {
            force: true,
          },
        )
      }
    },
    [setGlobalBanner, dateFull, t],
  )

  return addNotificationBanner
}
