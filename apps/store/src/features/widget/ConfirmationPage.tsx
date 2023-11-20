import styled from '@emotion/styled'
import { Button, Heading, Space, mq, theme } from 'ui'
import { StaticContent } from '@/components/ConfirmationPage/StaticContent'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { Discount } from '@/components/ShopBreakdown/Discount'
import { Divider } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import { useDiscountProps } from '@/components/ShopBreakdown/useDiscountExplanation'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ConfirmationStory } from '@/services/storyblok/storyblok'
import { Header } from './Header'
import { publishWidgetEvent } from './publishWidgetEvent'

type Props = {
  staticContent: ConfirmationStory['content']
  title: string
  shopSession: ShopSession
  backToAppButton?: string
}

export const ConfirmationPage = (props: Props) => {
  const handleClickBackToApp = () => {
    publishWidgetEvent({ status: 'close' })
  }

  const discount = useDiscountProps(props.shopSession.cart.redeemedCampaign)

  return (
    <Wrapper y={4}>
      <Header step="CONFIRMATION" />
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={4}>
            <Heading as="h1" variant="standard.24" align="center">
              {props.title}
            </Heading>
            <Space y={1}>
              {props.shopSession.cart.entries.map((item) => (
                <ProductItemContainer key={item.id} offer={item} />
              ))}

              {discount && (
                <>
                  <Discount {...discount} />
                  <Divider />
                </>
              )}

              <TotalAmountContainer cart={props.shopSession.cart} />
              {props.backToAppButton && (
                <Button onClick={handleClickBackToApp}>{props.backToAppButton}</Button>
              )}
            </Space>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>

      <StaticContent content={props.staticContent} />
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  paddingBottom: theme.space.lg,
  [mq.lg]: { paddingBottom: theme.space.xxl },
})
