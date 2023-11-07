import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useState, type ComponentProps, type FormEventHandler } from 'react'
import { Button, Heading, HedvigLogo, Space, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { STYLES } from '@/components/GridLayout/GridLayout.helper'
import * as ProgressIndicator from '@/components/ProgressIndicator/ProgressIndicator'
import * as RadioOptionList from '@/components/RadioOptionList/RadioOptionList'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { PageLink } from '@/utils/PageLink'
import { type WidgetProductName, getPriceTemplate, isWidgetProductName } from './widget.helpers'

const PRODUCTS: Array<{
  name: WidgetProductName
  title: string
  subtitle: string
  pillow: ComponentProps<typeof RadioOptionList.ProductOption>['pillow']
}> = [
  {
    name: 'SE_WIDGET_APARTMENT_RENT',
    title: 'Hyresrätt',
    subtitle: 'För dig som hyr bostad',
    pillow: {
      src: 'https://a.storyblok.com/f/165473/832x832/fb3ddd4632/hedvig-pillows-rental.png',
    },
  },
]

type Props = {
  flow: string
  shopSessionId: string
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
      <Header as="header">
        <LogoArea>
          <HedvigLogo />
        </LogoArea>

        <ProgressArea>
          <ProgressIndicator.Root>
            <ProgressIndicator.Step active={true}>Your info</ProgressIndicator.Step>
            <ProgressIndicator.Step>Sign</ProgressIndicator.Step>
            <ProgressIndicator.Step>Pay</ProgressIndicator.Step>
          </ProgressIndicator.Root>
        </ProgressArea>
      </Header>

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
                    {PRODUCTS.map((item) => (
                      <RadioOptionList.ProductOption
                        key={item.name}
                        value={item.name}
                        title={item.title}
                        subtitle={item.subtitle}
                        pillow={item.pillow}
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

const Header = styled(GridLayout.Root)({
  height: '4rem',
  alignItems: 'center',
})

const LogoArea = styled.div({
  display: 'none',
  [mq.md]: { display: 'block', gridColumn: '1 / span 2' },
})

const ProgressArea = styled.div(STYLES['1/3'].center, {
  gridColumn: '1 / span 12',
})

const CustomButton = styled(Button)({
  // Appear disabled but remain clickable (for a11y reasons)
  '&[aria-disabled=true]': {
    backgroundColor: theme.colors.gray200,
    color: theme.colors.textDisabled,
    cursor: 'default',
  },
})
