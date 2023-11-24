import { useApolloClient } from '@apollo/client'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useState, type FormEventHandler } from 'react'
import { Button, Heading, Space, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { type GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import * as RadioOptionList from '@/components/RadioOptionList/RadioOptionList'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { PageLink } from '@/utils/PageLink'
import { Header } from './Header'
import { createPriceIntent, getPriceTemplate } from './widget.helpers'

type Props = {
  flow: string
  shopSessionId: string
  products: GlobalProductMetadata
  compareInsurance: boolean
}

export const SelectProductPage = (props: Props) => {
  const { t } = useTranslation('widget')
  const [productName, setProductName] = useState<string | undefined>(undefined)

  const router = useRouter()
  const apolloClient = useApolloClient()
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!productName) throw new Error('Missing product')

    datadogRum.addAction('Widget Select Product', {
      shopSessionId: props.shopSessionId,
      flow: props.flow,
      productName,
    })

    const searchParams = new URLSearchParams(window.location.search)

    const [priceIntent, updatedSearchParams] = await createPriceIntent({
      service: priceIntentServiceInitClientSide(apolloClient),
      shopSessionId: props.shopSessionId,
      productName,
      searchParams,
      priceTemplate: getPriceTemplate(productName, props.compareInsurance),
    })

    datadogRum.setGlobalContextProperty('priceIntentId', priceIntent.id)

    const nextUrl = PageLink.widgetCalculatePrice({
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
    <Wrapper y={4}>
      <Header step="YOUR_INFO" />

      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={3.5}>
            <Heading as="h1" variant="standard.24" align="center">
              {t('SELECT_PAGE_TITLE')}
            </Heading>

            <form onSubmit={handleSubmit}>
              <Space y={0.5}>
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

                <CustomButton type="submit" variant="primary" aria-disabled={!productName}>
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
