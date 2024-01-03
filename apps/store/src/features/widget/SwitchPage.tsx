import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { Space, Heading, mq, theme, Text } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { InputStartDay } from '@/components/InputDay/InputStartDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { DiscountTooltip } from '@/components/ProductPage/PurchaseForm/DiscountTooltip/DiscountTooltip'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { ToggleCard } from '@/components/ToggleCard/ToggleCard'
import {
  type WidgetPriceIntentFragment,
  useCancellationRequestedUpdateMutation,
  useStartDateUpdateMutation,
  type ProductOfferFragment,
  type RedeemedCampaignFragment,
  useWidgetPriceIntentQuery,
} from '@/services/graphql/generated'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { convertToDate, formatAPIDate } from '@/utils/date'
import { PageLink } from '@/utils/PageLink'
import { useGetDiscountExplanation } from '@/utils/useDiscountExplanation'
import { useFormatter } from '@/utils/useFormatter'
import { Header } from './Header'

type Props = {
  shopSession: ShopSession
  priceIntent: WidgetPriceIntentFragment
  flow: string
  showBackButton?: boolean
}

export const SwitchPage = (props: Props) => {
  const { t } = useTranslation(['purchase-form', 'widget'])

  const offer = useMemo(() => {
    const cartEntries = new Set(props.shopSession.cart.entries.map((item) => item.id))
    const cartOffer = props.priceIntent.offers.find((item) => cartEntries.has(item.id))
    if (!cartOffer) throw new Error('SwitchPage | Missing cart offer')
    return cartOffer
  }, [props.priceIntent.offers, props.shopSession.cart.entries])

  return (
    <Wrapper y={3}>
      <Header step="YOUR_INFO" showBackButton={props.showBackButton} />

      <Space y={2.5}>
        <SpaceFlex align="center" direction="vertical">
          <Pillow size="xlarge" {...props.priceIntent.product.pillowImage} />
          <Heading as="h2" variant="standard.18" align="center">
            {props.priceIntent.product.displayNameShort}
          </Heading>
        </SpaceFlex>

        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={2}>
              <ProductPrice
                offer={offer}
                campaign={props.shopSession.cart.redeemedCampaign ?? undefined}
              />
              <Space y={0.25}>
                <IEXCancellation priceIntentId={props.priceIntent.id} offer={offer} />
                <ButtonNextLink
                  href={PageLink.widgetSign({
                    flow: props.flow,
                    shopSessionId: props.shopSession.id,
                    priceIntentId: props.priceIntent.id,
                  })}
                >
                  {t('widget:SELECT_CONTINUE_BUTTON')}
                </ButtonNextLink>
              </Space>
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  paddingBottom: theme.space.lg,
  [mq.lg]: { paddingBottom: theme.space.xxl },
})

type ProductPriceProps = {
  offer: ProductOfferFragment
  campaign?: RedeemedCampaignFragment
}

const ProductPrice = (props: ProductPriceProps) => {
  const formatter = useFormatter()

  const { t } = useTranslation(['purchase-form', 'cart'])
  const getDiscountExplanation = useGetDiscountExplanation()

  const tooltipProps = useMemo(() => {
    if (props.offer.priceMatch) {
      const company = props.offer.priceMatch.externalInsurer.displayName

      if (props.offer.priceMatch.priceReduction.amount < 1) {
        // No price reduction due to incomparable offers
        const amount = formatter.monthlyPrice(props.offer.priceMatch.externalPrice)
        return {
          children: t('PRICE_MATCH_BUBBLE_INCOMPARABLE_TITLE', { amount, company }),
          subtitle: t('PRICE_MATCH_BUBBLE_INCOMPARABLE_SUBTITLE'),
          color: 'gray',
        } as const
      }

      const priceReduction = formatter.monthlyPrice(props.offer.priceMatch.priceReduction)

      return {
        children: t('PRICE_MATCH_BUBBLE_SUCCESS_TITLE', { amount: priceReduction }),
        subtitle: t('PRICE_MATCH_BUBBLE_SUCCESS_SUBTITLE', { company }),
        color: 'green',
      } as const
    }

    if (props.campaign && props.offer.cost.discount.amount > 0) {
      return {
        children: getDiscountExplanation({
          ...props.campaign.discount,
          amount: props.offer.cost.discount,
        }),
        subtitle: t('DISCOUNT_PRICE_AFTER_EXPIRATION', {
          amount: formatter.monthlyPrice(props.offer.cost.gross),
          ns: 'cart',
        }),
        color: 'green',
      } as const
    }
  }, [t, formatter, getDiscountExplanation, props.offer, props.campaign])

  return (
    <SpaceFlex direction="vertical" align="center" space={1}>
      {tooltipProps && <DiscountTooltip {...tooltipProps} />}
      <Space y={0.5}>
        <Text as="p" align="center" size="xl">
          {formatter.monthlyPrice(props.offer.cost.net)}
        </Text>
      </Space>
    </SpaceFlex>
  )
}

type IEXCancellationProps = {
  priceIntentId: string
  offer: ProductOfferFragment
}

const IEXCancellation = (props: IEXCancellationProps) => {
  const { t } = useTranslation('purchase-form')

  const { data } = useWidgetPriceIntentQuery({ variables: { priceIntentId: props.priceIntentId } })
  if (!data) throw new Error('Cancellation | Missing data')

  const productOfferIds = data.priceIntent.offers.map((item) => item.id)
  const [mutate] = useCancellationRequestedUpdateMutation()
  const handleCheckedChange = (checked: boolean) => {
    mutate({ variables: { productOfferIds, requested: checked } })
  }

  const startDate = convertToDate(props.offer.startDate)
  const [updateStartDate] = useStartDateUpdateMutation()
  const handleChangeStartDate = (date: Date) => {
    updateStartDate({
      variables: {
        productOfferIds,
        startDate: formatAPIDate(date),
      },
    })
  }

  return (
    <Space y={0.25}>
      <ToggleCard
        label={t('AUTO_SWITCH_FIELD_LABEL')}
        defaultChecked={props.offer.cancellation.requested}
        onCheckedChange={handleCheckedChange}
      >
        {props.offer.cancellation.requested && (
          <Text as="p" size="xs" color="textSecondary">
            {t('AUTO_SWITCH_FIELD_MESSAGE', {
              COMPANY: props.offer.cancellation.externalInsurer?.displayName,
            })}
          </Text>
        )}
      </ToggleCard>
      {!props.offer.cancellation.requested && (
        <InputStartDay date={startDate ?? undefined} onChange={handleChangeStartDate} />
      )}
    </Space>
  )
}
