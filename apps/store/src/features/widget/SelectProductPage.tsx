import { useApolloClient } from '@apollo/client'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { type FormEventHandler, useState } from 'react'
import { Button, Heading, mq, Space, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { type GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import * as RadioOptionList from '@/components/RadioOptionList/RadioOptionList'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { useTracking } from '@/services/Tracking/useTracking'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { Header } from './Header'
import { createPriceIntent, getWidgetPriceTemplate } from './widget.helpers'

type Props = {
  flow: string
  shopSessionId: string
  products: GlobalProductMetadata
  compareInsurance: boolean
  showBackButton?: boolean
}

export const SelectProductPage = (props: Props) => {
  const { t } = useTranslation('widget')
  const [productName, setProductName] = useState<string | undefined>(undefined)

  const router = useRouter()
  const locale = useRoutingLocale()
  const apolloClient = useApolloClient()
  const tracking = useTracking()
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const product = props.products.find((item) => item.name === productName)
    if (!product) throw new Error(`Product not found: ${productName}`)

    datadogRum.addAction('Widget Select Product', {
      shopSessionId: props.shopSessionId,
      flow: props.flow,
      productName,
    })
    tracking.reportSelectItem(product, 'widget')

    const searchParams = new URLSearchParams(window.location.search)

    const [priceIntent, updatedSearchParams] = await createPriceIntent({
      service: priceIntentServiceInitClientSide(apolloClient),
      shopSessionId: props.shopSessionId,
      productName: product.name,
      searchParams,
      priceTemplate: getWidgetPriceTemplate(product.name, props.compareInsurance),
    })

    datadogRum.setGlobalContextProperty('priceIntentId', priceIntent.id)

    const nextUrl = PageLink.widgetCalculatePrice({
      locale,
      flow: props.flow,
      shopSessionId: props.shopSessionId,
      priceIntentId: priceIntent.id,
    })
    nextUrl.search = updatedSearchParams.toString()

    await router.push(nextUrl)
  }

  const handleValueChange = (value: string) => {
    setProductName(value)
  }

  return (
    <Wrapper y={2.5}>
      <Header step="YOUR_INFO" showBackButton={props.showBackButton} />

      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={3.5}>
            <HeadingWrapper>
              <Heading as="h1" variant="standard.24" align="center" balance={true}>
                {t('SELECT_PAGE_TITLE')}
              </Heading>
            </HeadingWrapper>

            <form onSubmit={handleSubmit}>
              <Space y={1}>
                <RadioOptionList.Root
                  value={productName}
                  onValueChange={handleValueChange}
                  required={true}
                >
                  <Space y={0.5}>
                    {props.products.map((item) => (
                      <RadioOptionList.ProductOption
                        key={item.name}
                        value={item.name}
                        title={item.displayNameShort}
                        subtitle={item.tagline}
                        pillow={item.pillowImage}
                      />
                    ))}
                  </Space>
                </RadioOptionList.Root>

                <CustomButton
                  type="submit"
                  variant="primary"
                  aria-disabled={!productName}
                  fullWidth={true}
                >
                  {t('SELECT_CONTINUE_BUTTON')}
                </CustomButton>
              </Space>
            </form>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  paddingBottom: theme.space.lg,
  [mq.lg]: { paddingBottom: theme.space.xxl },
})

const CustomButton = styled(Button)({
  // Appear disabled but remain clickable (for a11y reasons)
  '&[aria-disabled=true]': {
    backgroundColor: theme.colors.gray200,
    color: theme.colors.textDisabled,
    cursor: 'default',
  },
})

const HeadingWrapper = styled.div({
  [mq.md]: {
    width: '50%',
    marginInline: 'auto',
  },
})
