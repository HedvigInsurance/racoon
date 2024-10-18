import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { Button } from 'ui/src/components/Button/Button'
import { Text, Heading, Space, Divider, theme, LockIcon } from 'ui'
import { StaticContent } from '@/app/[locale]/confirmation/[shopSessionId]/components/StaticContent/StaticContent'
import { SwitchingAssistantSection } from '@/app/[locale]/confirmation/[shopSessionId]/components/SwitchingAssistantSection/SwitchingAssistantSection'
import type { SwitchingAssistantData } from '@/app/[locale]/confirmation/[shopSessionId]/components/SwitchingAssistantSection/SwitchingAssistantSection.types'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { InputDay } from '@/components/InputDay/InputDay'
import { useGetStartDateProps } from '@/components/ProductItem/useGetStartDateProps'
import { ProductItem } from '@/components/ProductItemV2/ProductItem'
import type { Offer } from '@/components/ProductItemV2/ProductItem.types'
import { Discount } from '@/components/ShopBreakdown/Discount'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import { useDiscountProps } from '@/components/ShopBreakdown/useDiscountExplanation'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import type { ConfirmationStory } from '@/services/storyblok/storyblok'
import { convertToDate } from '@/utils/date'
import { wrapper, fakeInput, fakeInputRow } from './ConfirmationPage.css'
import { Header } from './Header'
import { publishWidgetEvent } from './publishWidgetEvent'

type Props = {
  staticContent: ConfirmationStory['content']
  title: string
  shopSession: ShopSession
  backToAppButton?: string
  switching?: SwitchingAssistantData
}

export const ConfirmationPage = (props: Props) => {
  const handleClickBackToApp = () => {
    datadogRum.addAction('Widget Back To App')
    publishWidgetEvent.close()
  }

  const discount = useDiscountProps(props.shopSession.cart.redeemedCampaign)

  return (
    <div className={wrapper}>
      <Header step="CONFIRMATION" />

      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={4}>
            <Space y={{ base: 3, lg: 4.5 }}>
              <Heading as="h1" variant="standard.24" align="center">
                {props.title}
              </Heading>
              <Space y={1}>
                {props.shopSession.cart.entries.map((item) => (
                  <ProductItem key={item.id} selectedOffer={item}>
                    <ViewUI selectedOffer={item} />
                  </ProductItem>
                ))}

                {discount && (
                  <>
                    <Discount {...discount} />
                    <Divider />
                  </>
                )}

                <TotalAmountContainer cart={props.shopSession.cart} />
                {props.backToAppButton && (
                  <Button onClick={handleClickBackToApp} fullWidth={true}>
                    {props.backToAppButton}
                  </Button>
                )}
              </Space>
            </Space>

            {props.switching && <SwitchingAssistantSection {...props.switching} />}
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>

      <StaticContent content={props.staticContent} />
    </div>
  )
}

type ViewUIProps = {
  selectedOffer: Offer
}

function ViewUI(props: ViewUIProps) {
  const { t } = useTranslation(['cart', 'purchase-form'])
  const getStartDateProps = useGetStartDateProps()

  const { tooltip } = getStartDateProps({
    data: props.selectedOffer.priceIntentData,
    startDate: props.selectedOffer.startDate,
  })

  const handleClickTooltip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <>
      {props.selectedOffer.cancellation.requested ? (
        <div className={fakeInput}>
          <Text as="p" color="textTranslucentSecondary" size="xs">
            {t('purchase-form:START_DATE_FIELD_LABEL')}
          </Text>
          <div className={fakeInputRow}>
            <Text as="p" size="xl">
              {t('CART_ENTRY_AUTO_SWITCH')}
            </Text>

            <Tooltip message={tooltip}>
              <button onClick={handleClickTooltip}>
                <LockIcon size="1rem" color={theme.colors.textSecondary} />
              </button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <InputDay
          label={t('purchase-form:START_DATE_FIELD_LABEL')}
          selected={convertToDate(props.selectedOffer.startDate) ?? undefined}
          disabled={true}
        />
      )}
    </>
  )
}
