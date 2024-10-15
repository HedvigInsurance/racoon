'use client'

import { Divider, Heading, Text, yStack } from 'ui'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { ProductItemContractContainerCar } from '@/features/carDealership/ProductItemContractContainer'
import { CartTotal } from '@/features/CartTotal/CartTotal'
import { SasEurobonusSectionContainer } from '@/features/sas/SasEurobonusSection'
import { StaticContent } from './components/StaticContent/StaticContent'
import { SuccessAnimation } from './components/SuccessAnimation/SuccessAnimation'
import { SwitchingAssistantSection } from './components/SwitchingAssistantSection/SwitchingAssistantSection'
import { container } from './ConfirmationPage.css'
import { type ConfirmationPageProps } from './ConfirmationPage.types'

export const ConfirmationPage = ({
  story,
  carTrialContract,
  cart,
  switching,
  memberPartnerData,
}: ConfirmationPageProps) => {
  const cartTotalCost = cart.cost.gross.amount

  return (
    <SuccessAnimation>
      <main
        className={yStack({
          gap: {
            _: 'xxl',
            sm: 'xxxl',
          },
          paddingTop: 'xxl',
        })}
      >
        <div className={container}>
          <section className={yStack({ gap: { _: 'md', sm: 'lg' } })}>
            {story ? (
              <header>
                <Heading as="h2" variant="standard.24">
                  {story.content.title}
                </Heading>

                {story.content.subTitle ? (
                  <Text color="textSecondary" size="xl">
                    {story.content.subTitle}
                  </Text>
                ) : null}
              </header>
            ) : null}

            {carTrialContract && <ProductItemContractContainerCar contract={carTrialContract} />}

            {cart.entries.map((offer) => (
              <ProductCard.Root key={offer.id} offer={offer}>
                <ProductCard.Header />
                <ProductCard.Details />
                <ProductCard.Breakdown />
                <Divider />
                <ProductCard.TotalPrice />
              </ProductCard.Root>
            ))}

            {cartTotalCost > 0 && <CartTotal cart={cart} />}
          </section>

          {switching && (
            <section>
              <SwitchingAssistantSection {...switching} />
            </section>
          )}

          {memberPartnerData?.sas?.eligible && (
            <section>
              <SasEurobonusSectionContainer
                initialValue={memberPartnerData.sas.eurobonusNumber ?? ''}
              />
            </section>
          )}
        </div>

        {/* Treating 'story' as optional here to provide a fallback confirmation page instead crashing the page */}
        {story && <StaticContent content={story.content} />}
      </main>
    </SuccessAnimation>
  )
}
