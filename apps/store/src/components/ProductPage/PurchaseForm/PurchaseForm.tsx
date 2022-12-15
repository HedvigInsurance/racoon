import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { ReactNode, useRef, useState } from 'react'
import { Button, Heading, Space, useBreakpoint } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { ProductItemProps } from '@/components/CartNotification/ProductItem'
import { Pillow } from '@/components/Pillow/Pillow'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntent.helpers'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useFormatter } from '@/utils/useFormatter'
import useRouterRefresh from '@/utils/useRouterRefresh'
import { usePriceIntent } from '../usePriceIntent'
import { CircledHSuperscript } from './CircledHSuperscript'
import { OfferPresenter } from './OfferPresenter'
import { PriceCalculatorDialog } from './PriceCalculatorDialog'

export const PurchaseForm = () => {
  const [isEditingPriceCalculator, setIsEditingPriceCalculator] = useState(false)

  const { priceTemplate, productData } = useProductPageContext()
  const { shopSession } = useShopSession()
  const { data: { priceIntent } = {} } = usePriceIntent({
    shopSession,
    priceTemplate: priceTemplate,
    productName: productData.name,
  })

  return (
    <Layout pillowSize={isEditingPriceCalculator ? 'small' : 'large'}>
      {(notifyProductAdded) => {
        if (!shopSession || !priceIntent) return <PendingState />

        if (isEditingPriceCalculator) {
          return (
            <EditingState
              priceIntent={priceIntent}
              onToggleDialog={setIsEditingPriceCalculator}
              onSuccess={() => setIsEditingPriceCalculator(false)}
            />
          )
        }

        if (priceIntent.offers.length > 0) {
          return (
            <ShowOfferState
              shopSession={shopSession}
              priceIntent={priceIntent}
              onAddedToCart={notifyProductAdded}
            />
          )
        }

        return <IdleState onClick={() => setIsEditingPriceCalculator(true)} />
      }}
    </Layout>
  )
}

type LayoutProps = {
  children: (notifyProductAdded: (item: ProductItemProps) => void) => ReactNode
  pillowSize: 'small' | 'large'
}

const Layout = ({ children, pillowSize }: LayoutProps) => {
  const toastRef = useRef<CartToastAttributes | null>(null)
  const { productData } = useProductPageContext()

  const notifyProductAdded = (item: ProductItemProps) => {
    toastRef.current?.publish(item)
  }

  return (
    <>
      <PurchaseFormTop>
        <OfferPresenterWrapper>
          <SpaceFlex space={1} align="center" direction="vertical">
            <Pillow
              size={pillowSize === 'large' ? 'xlarge' : 'large'}
              {...productData.pillowImage}
            />
            <Space y={0.5}>
              <Heading as="h2" variant="standard.24" textAlignment="center">
                {productData.displayNameShort}
                <CircledHSuperscript />
              </Heading>
              <Text size="s" color="secondaryText" align="center">
                {productData.displayNameFull}
              </Text>
            </Space>
          </SpaceFlex>
        </OfferPresenterWrapper>

        {children(notifyProductAdded)}
      </PurchaseFormTop>
      <CartToast ref={toastRef} />
    </>
  )
}

const PendingState = () => {
  return (
    <OfferPresenterWrapper>
      <ButtonWrapper>
        <Button disabled fullWidth>
          Calculate price
        </Button>
      </ButtonWrapper>
    </OfferPresenterWrapper>
  )
}

type IdleStateProps = { onClick: () => void }

const IdleState = ({ onClick }: IdleStateProps) => {
  return (
    <OfferPresenterWrapper>
      <ButtonWrapper>
        <Button onClick={onClick} fullWidth>
          Calculate price
        </Button>
      </ButtonWrapper>
    </OfferPresenterWrapper>
  )
}

type EditingStateProps = {
  priceIntent: PriceIntent
  onToggleDialog: (open: boolean) => void
  onSuccess: () => void
}

const EditingState = (props: EditingStateProps) => {
  const { onToggleDialog, priceIntent, onSuccess } = props
  const { priceTemplate, productData } = useProductPageContext()
  const isLarge = useBreakpoint('lg')

  const priceCalculator = (
    <PriceCalculatorWrapper>
      <PriceCalculator
        priceTemplate={priceTemplate}
        priceIntent={priceIntent}
        onSuccess={onSuccess}
      />
    </PriceCalculatorWrapper>
  )

  if (isLarge) return priceCalculator

  return (
    <PriceCalculatorDialog
      isOpen
      toggleDialog={onToggleDialog}
      header={
        <SpaceFlex direction="vertical" align="center" space={0.5}>
          <Pillow size="large" {...productData.pillowImage} />
          <Heading as="h2" variant="standard.18">
            {productData.displayNameShort}
            <CircledHSuperscript />
          </Heading>
        </SpaceFlex>
      }
    >
      {priceCalculator}
    </PriceCalculatorDialog>
  )
}

type ShowOfferStateProps = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  onAddedToCart: (item: ProductItemProps) => void
}

const ShowOfferState = (props: ShowOfferStateProps) => {
  const { shopSession, priceIntent, onAddedToCart } = props
  const { priceTemplate, story } = useProductPageContext()
  const scrollPastRef = useRef<HTMLDivElement | null>(null)

  const refresh = useRouterRefresh()
  const apolloClient = useApolloClient()
  const formatter = useFormatter()
  const handleAddedToCart = (addedProdutOffer: ProductOfferFragment) => {
    onAddedToCart({
      name: story.content.name,
      price: formatter.money(addedProdutOffer.price),
    })
    priceIntentServiceInitClientSide({ apolloClient, shopSession }).clear(priceTemplate.name)
    refresh()
  }

  return (
    <OfferPresenterWrapper>
      <OfferPresenter
        priceIntent={priceIntent}
        shopSession={shopSession}
        scrollPastRef={scrollPastRef}
        onAddedToCart={handleAddedToCart}
      />
    </OfferPresenterWrapper>
  )
}

const PurchaseFormTop = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '4.5rem',
  paddingTop: '9vh',
  paddingBottom: '9vh',
})

const ButtonWrapper = styled.div({
  maxWidth: '21rem',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const OfferPresenterWrapper = styled.div({
  paddingLeft: '1rem',
  paddingRight: '1rem',

  width: '100%',
  maxWidth: '21rem',
  margin: '0 auto',
})

const PriceCalculatorWrapper = styled.div({
  width: '100%',
  maxWidth: '21rem',
  margin: '0 auto',
})
