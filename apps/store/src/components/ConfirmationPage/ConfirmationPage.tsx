import styled from '@emotion/styled'
import { StoryblokComponent } from '@storyblok/react'
import { Heading, mq, Space, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import { ProductItemContractContainerCar } from '@/features/carDealership/ProductItemContractContainer'
import { SasEurobonusSectionContainer } from '@/features/sas/SasEurobonusSection'
import { ConfirmationStory } from '@/services/storyblok/storyblok'
import { Features } from '@/utils/Features'
import { ConfirmationPageProps } from './ConfirmationPage.types'
import { StaticContent } from './StaticContent'
import { SwitchingAssistantSection } from './SwitchingAssistantSection/SwitchingAssistantSection'

type Props = ConfirmationPageProps & {
  story: ConfirmationStory
}

export const ConfirmationPage = (props: Props) => {
  const cartTotalCost = props.cart.cost.gross.amount

  return (
    <Wrapper>
      <Space y={4}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={4}>
              <Space y={{ base: 3, lg: 4.5 }}>
                <Heading as="h1" variant="standard.24" align="center">
                  {props.story.content.title}
                </Heading>

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

              {props.story.content.ctaSection?.map((nestedBlock) => (
                <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
              ))}

              {props.switching && <SwitchingAssistantSection {...props.switching} />}

              {Features.enabled('SAS_PARTNERSHIP') && props.memberPartnerData?.sas?.eligible && (
                <SasEurobonusSectionContainer
                  initialValue={props.memberPartnerData.sas.eurobonusNumber ?? ''}
                />
              )}
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>

        <StaticContent content={props.story.content} />
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  paddingTop: theme.space.md,
  [mq.lg]: { paddingTop: theme.space.xxxl },
})
