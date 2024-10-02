'use client'

import styled from '@emotion/styled'
import { Heading, mq, Space, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import { ProductItemContractContainerCar } from '@/features/carDealership/ProductItemContractContainer'
import { SasEurobonusSectionContainer } from '@/features/sas/SasEurobonusSection'
import { StaticContent } from './components/StaticContent/StaticContent'
import { SuccessAnimation } from './components/SuccessAnimation/SuccessAnimation'
import { SwitchingAssistantSection } from './components/SwitchingAssistantSection/SwitchingAssistantSection'
import { type ConfirmationPageProps } from './ConfirmationPage.types'

export const ConfirmationPage = (props: ConfirmationPageProps) => {
  const cartTotalCost = props.cart.cost.gross.amount

  return (
    <SuccessAnimation>
      <Wrapper>
        <Space y={4}>
          <GridLayout.Root>
            <GridLayout.Content width="1/3" align="center">
              <Space y={4}>
                <Space y={{ base: 3, lg: 4.5 }}>
                  {props.story && (
                    <Heading as="h1" variant="standard.24" align="center">
                      {props.story.content.title}
                    </Heading>
                  )}
                  <ShopBreakdown>
                    {props.carTrialContract && (
                      <ProductItemContractContainerCar contract={props.carTrialContract} />
                    )}
                    {props.cart.entries.map((item) => (
                      <ProductItemContainer key={item.id} offer={item} />
                    ))}
                    {/* We might have some cases of confirmation pages for shop sessions that doesn't include any products into the cart: car dealership */}
                    {cartTotalCost > 0 && <TotalAmountContainer cart={props.cart} />}
                  </ShopBreakdown>
                </Space>

                {props.switching && <SwitchingAssistantSection {...props.switching} />}

                {props.memberPartnerData?.sas?.eligible && (
                  <SasEurobonusSectionContainer
                    initialValue={props.memberPartnerData.sas.eurobonusNumber ?? ''}
                  />
                )}
              </Space>
            </GridLayout.Content>
          </GridLayout.Root>

          {/* Treating 'story' as optional here to provide a fallback confirmation page instead crashing the page */}
          {props.story && <StaticContent content={props.story.content} />}
        </Space>
      </Wrapper>
    </SuccessAnimation>
  )
}

const Wrapper = styled.div({
  paddingTop: theme.space.md,
  [mq.lg]: { paddingTop: theme.space.xxxl },
})
