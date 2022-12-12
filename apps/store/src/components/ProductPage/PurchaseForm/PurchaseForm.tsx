import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { ReactNode, useRef, useState } from 'react'
import { Button, Heading } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { ProductItemProps } from '@/components/CartNotification/ProductItem'
import { Pillow } from '@/components/Pillow/Pillow'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntent.helpers'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import useRouterRefresh from '@/utils/useRouterRefresh'
import { usePriceIntent } from '../usePriceIntent'
import { CircledHSuperscript } from './CircledHSuperscript'
import { OfferPresenter } from './OfferPresenter'
import { PriceCalculatorDialog } from './PriceCalculatorDialog'

export const PurchaseForm = () => {
  const [isEditingPriceCalculator, setIsEditingPriceCalculator] = useState(false)

  const { priceTemplate, story } = useProductPageContext()
  const { shopSession } = useShopSession()
  const { data: { priceIntent } = {} } = usePriceIntent({
    shopSession,
    priceTemplate: priceTemplate,
    productName: story.content.productId,
  })

  return (
    <Layout>
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
}

const Layout = ({ children }: LayoutProps) => {
  const toastRef = useRef<CartToastAttributes | null>(null)
  const { story } = useProductPageContext()

  const notifyProductAdded = (item: ProductItemProps) => {
    toastRef.current?.publish(item)
  }

  return (
    <>
      <PurchaseFormTop>
        <Wrapper>
          <SpaceFlex space={1} align="center" direction="vertical">
            <Pillow size="xlarge" />
            <Heading as="h2" variant="standard.24">
              {story.content.name}
              <CircledHSuperscript />
            </Heading>
          </SpaceFlex>
        </Wrapper>

        {children(notifyProductAdded)}
      </PurchaseFormTop>
      <CartToast ref={toastRef} />
    </>
  )
}

const PendingState = () => {
  return (
    <Wrapper>
      <ButtonWrapper>
        <Button disabled fullWidth>
          Calculate price
        </Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

type IdleStateProps = { onClick: () => void }

const IdleState = ({ onClick }: IdleStateProps) => {
  return (
    <Wrapper>
      <ButtonWrapper>
        <Button onClick={onClick} fullWidth>
          Calculate price
        </Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

type EditingStateProps = {
  priceIntent: PriceIntent
  onToggleDialog: (open: boolean) => void
  onSuccess: () => void
}

const EditingState = (props: EditingStateProps) => {
  const { onToggleDialog, priceIntent, onSuccess } = props
  const { priceTemplate, story } = useProductPageContext()

  return (
    <PriceCalculatorDialog
      isOpen
      toggleDialog={onToggleDialog}
      header={
        <SpaceFlex direction="vertical" align="center" space={0.5}>
          <Pillow size="large" />
          <Heading as="h2" variant="standard.18">
            {story.content.name}
            <CircledHSuperscript />
          </Heading>
        </SpaceFlex>
      }
    >
      <PriceCalculator
        priceTemplate={priceTemplate}
        priceIntent={priceIntent}
        onSuccess={onSuccess}
      />
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
  const { locale } = useCurrentLocale()
  const currencyFormatter = useCurrencyFormatter(shopSession.currencyCode)
  const handleAddedToCart = (addedProdutOffer: ProductOfferFragment) => {
    onAddedToCart({
      name: story.content.name,
      price: currencyFormatter.format(addedProdutOffer.price.amount),
    })
    priceIntentServiceInitClientSide({ apolloClient, locale, shopSession }).clear(
      priceTemplate.name,
    )
    refresh()
  }

  return (
    <Wrapper>
      <OfferPresenter
        priceIntent={priceIntent}
        shopSession={shopSession}
        scrollPastRef={scrollPastRef}
        onAddedToCart={handleAddedToCart}
      />
    </Wrapper>
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

const Wrapper = styled.div({
  paddingLeft: '1rem',
  paddingRight: '1rem',
})
