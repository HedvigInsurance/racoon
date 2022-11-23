import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useState } from 'react'
import { Button, Heading, Space } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { PriceForm } from '@/components/PriceForm/PriceForm'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntent.helpers'
import { useRefreshData } from '@/utils/useRefreshData'
import { PriceFormModal } from '../PriceFormModal/PriceFormModal'
import { OfferPresenter } from './OfferPresenter'

// TODO: get from API
const PLACEHOLDER_GRADIENT = ['#C0E4F3', '#99AAD8'] as const

export const PurchaseForm = () => {
  const [isEditingPriceForm, setIsEditingPriceFormOpen] = useState(false)
  const { priceTemplate, priceIntent, shopSession, story } = useProductPageContext()

  const [refreshData, isLoadingData] = useRefreshData()
  const handleCalculatePriceSuccess = () => {
    refreshData()
    setIsEditingPriceFormOpen(false)
  }

  const apolloClient = useApolloClient()
  const handleAddedToCart = () => {
    priceIntentServiceInitClientSide({ shopSession, apolloClient }).clear(priceTemplate.name)
    refreshData()
  }

  const productDisplayName = story.content.name

  // TODO: Show "loading offers" state or don't close modal while still loading
  const bodyContent =
    priceIntent.offers.length === 0 ? (
      <Wrapper>
        <Button onClick={() => setIsEditingPriceFormOpen(true)} fullWidth>
          Calculate price
        </Button>
      </Wrapper>
    ) : (
      <Wrapper>
        <OfferPresenter
          shopSession={shopSession}
          story={story}
          priceIntent={priceIntent}
          onAddedToCart={handleAddedToCart}
        />
      </Wrapper>
    )

  return (
    <>
      <Space y={1.5}>
        <Wrapper>
          <SpaceFlex space={1} align="center" direction="vertical">
            <Pillow
              size="xlarge"
              fromColor={PLACEHOLDER_GRADIENT[0]}
              toColor={PLACEHOLDER_GRADIENT[1]}
            />
            <Heading as="h2" variant="standard.24">
              {productDisplayName}
            </Heading>
          </SpaceFlex>
        </Wrapper>

        {!isEditingPriceForm && bodyContent}

        <PriceFormModal
          isOpen={isEditingPriceForm}
          toggleDialog={setIsEditingPriceFormOpen}
          header={
            <>
              <Pillow
                size="large"
                fromColor={PLACEHOLDER_GRADIENT[0]}
                toColor={PLACEHOLDER_GRADIENT[1]}
              />
              <Heading as="h2" variant="standard.18">
                {productDisplayName}
              </Heading>
            </>
          }
        >
          <PriceForm
            priceTemplate={priceTemplate}
            priceIntent={priceIntent}
            onSuccess={handleCalculatePriceSuccess}
            onUpdated={refreshData}
            loading={isLoadingData}
          />
        </PriceFormModal>
      </Space>
    </>
  )
}

const Wrapper = styled.div({
  paddingLeft: '1rem',
  paddingRight: '1rem',
})
