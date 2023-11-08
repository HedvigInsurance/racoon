import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useState, type FormEventHandler } from 'react'
import { Button, Heading, Space, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { type GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import * as RadioOptionList from '@/components/RadioOptionList/RadioOptionList'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { PageLink } from '@/utils/PageLink'
import { Header } from './Header'
import { type WidgetProductName, getPriceTemplate, isWidgetProductName } from './widget.helpers'

type Props = {
  flow: string
  shopSessionId: string
  products: GlobalProductMetadata
}

export const SelectProductPage = (props: Props) => {
  const [productName, setProductName] = useState<WidgetProductName | undefined>(undefined)

  const router = useRouter()
  const apolloClient = useApolloClient()
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!productName) throw new Error('Missing product')

    const priceIntentService = priceIntentServiceInitClientSide(apolloClient)
    const priceIntent = await priceIntentService.create({
      productName: productName,
      priceTemplate: getPriceTemplate(productName),
      shopSessionId: props.shopSessionId,
    })

    await router.push(
      PageLink.widgetCalculatePrice({
        flow: props.flow,
        shopSessionId: props.shopSessionId,
        priceIntentId: priceIntent.id,
      }),
    )
  }

  const handleValueChange = (value: string) => {
    if (!isWidgetProductName(value)) throw new Error(`Invalid product: ${value}`)
    setProductName(value)
  }

  return (
    <Space y={4}>
      <Header step="YOUR_INFO" />

      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={3.5}>
            <Heading as="h1" variant="standard.24" align="center">
              Select your insurance
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
                  Continue
                </CustomButton>
              </Space>
            </form>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
    </Space>
  )
}

const CustomButton = styled(Button)({
  // Appear disabled but remain clickable (for a11y reasons)
  '&[aria-disabled=true]': {
    backgroundColor: theme.colors.gray200,
    color: theme.colors.textDisabled,
    cursor: 'default',
  },
})
