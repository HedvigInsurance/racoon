import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { motion, Variants } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { ReactNode, useRef, useState } from 'react'
import { Button, Heading, mq, Space, Text, useBreakpoint } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { ProductItemProps } from '@/components/CartNotification/ProductItem'
import { Pillow } from '@/components/Pillow/Pillow'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { usePriceIntent } from '@/components/ProductPage/PriceIntentContext'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { ProductOfferFragment, usePriceIntentConfirmMutation } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useFormatter } from '@/utils/useFormatter'
import { useGetMutationError } from '@/utils/useGetMutationError'
import useRouterRefresh from '@/utils/useRouterRefresh'
import { ScrollPast } from '../ScrollPast/ScrollPast'
import { CircledHSuperscript } from './CircledHSuperscript'
import { OfferPresenter } from './OfferPresenter'
import { PriceCalculatorDialog } from './PriceCalculatorDialog'
import { PURCHASE_FORM_MAX_WIDTH } from './PurchaseForm.constants'

export const PurchaseForm = () => {
  const [isEditingPriceCalculator, setIsEditingPriceCalculator] = useState(false)
  const { shopSession } = useShopSession()
  const { data: { priceIntent } = {} } = usePriceIntent()

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
              onClickEdit={() => setIsEditingPriceCalculator(true)}
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
        <SectionWrapper>
          <SpaceFlex space={1} align="center" direction="vertical">
            <Pillow
              size={pillowSize === 'large' ? 'xlarge' : 'large'}
              {...productData.pillowImage}
            />
            <Space y={0.5}>
              <Heading as="h2" variant="standard.24" align="center">
                {productData.displayNameShort}
                <CircledHSuperscript />
              </Heading>
              <Text size="xs" color="textSecondary" align="center">
                {productData.displayNameFull}
              </Text>
            </Space>
          </SpaceFlex>
        </SectionWrapper>

        {children(notifyProductAdded)}
      </PurchaseFormTop>
      <CartToast ref={toastRef} />
    </>
  )
}

const Tagline = () => {
  const { story } = useProductPageContext()
  return (
    <TaglineWrapper>
      <Text color="textSecondary" size="xs">
        {story.content.tagline}
      </Text>
    </TaglineWrapper>
  )
}

const TaglineWrapper = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})

const PendingState = () => {
  const { t } = useTranslation('purchase-form')

  return (
    <SectionWrapper>
      <Space y={0.5}>
        <Tagline />
        <OpenModalButtonWrapper>
          <Button disabled>{t('OPEN_PRICE_CALCULATOR_BUTTON')}</Button>
        </OpenModalButtonWrapper>
      </Space>
    </SectionWrapper>
  )
}

type IdleStateProps = { onClick: () => void }

const IdleState = ({ onClick }: IdleStateProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('purchase-form')

  const button = <Button onClick={onClick}>{t('OPEN_PRICE_CALCULATOR_BUTTON')}</Button>

  return (
    <>
      <SectionWrapper ref={ref}>
        <Space y={0.5}>
          <Tagline />
          <OpenModalButtonWrapper>{button}</OpenModalButtonWrapper>
        </Space>
      </SectionWrapper>
      <ScrollPast targetRef={ref}>
        <StickyButtonWrapper>{button}</StickyButtonWrapper>
      </ScrollPast>
    </>
  )
}

type EditingStateProps = {
  priceIntent: PriceIntent
  onToggleDialog: (open: boolean) => void
  onSuccess: () => void
}

const EditingState = (props: EditingStateProps) => {
  const { onToggleDialog, priceIntent, onSuccess } = props
  const getMutationError = useGetMutationError()
  const { priceTemplate, productData } = useProductPageContext()
  const isLarge = useBreakpoint('lg')
  const tracking = useTracking()

  const [confirmPriceIntent, result] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: priceIntent.id },
    onError(error) {
      datadogLogs.logger.error('Failed to confirm price intent', {
        error,
        priceIntentId: priceIntent.id,
      })
      setIsLoadingPrice(false)
    },
  })
  const [isLoadingPrice, setIsLoadingPrice] = useState(result.loading)

  const handleConfirm = async () => {
    setIsLoadingPrice(true)

    try {
      const [{ data }] = await Promise.all([confirmPriceIntent(), completePriceLoader()])
      const updatedPriceIntent = data?.priceIntentConfirm.priceIntent
      if (updatedPriceIntent) {
        tracking.setPriceIntentContext(updatedPriceIntent)
        updatedPriceIntent.offers.forEach((offer) => tracking.reportOfferCreated(offer))
        onSuccess()
      } else {
        setIsLoadingPrice(false)
      }
    } catch (error) {
      // Error is already handled in onError callback
      console.debug('Error confirming price intent', error)
    }
  }

  const confirmError = getMutationError(result, result.data?.priceIntentConfirm)

  const content = isLoadingPrice ? (
    <PriceLoaderWrapper>
      <PriceLoader />
    </PriceLoaderWrapper>
  ) : (
    <PriceCalculatorWrapper>
      <PriceCalculator
        priceTemplate={priceTemplate}
        priceIntent={priceIntent}
        onConfirm={handleConfirm}
        error={confirmError?.message}
      />
    </PriceCalculatorWrapper>
  )

  if (isLarge) return content

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
      {content}
    </PriceCalculatorDialog>
  )
}

const ANIMATION_DURATION_SEC = 2

const completePriceLoader = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ANIMATION_DURATION_SEC * 1000)
  })

const PriceLoader = () => {
  const { t } = useTranslation('purchase-form')

  const variants: Variants = {
    enter: {
      width: '0%',
    },
    animate: {
      width: '100%',
      transition: {
        delay: 0,
        // Acconut for delay in mounting the component
        duration: ANIMATION_DURATION_SEC * 0.8,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <Space y={2}>
      <Text size="md" align="center">
        {t('LOADING_PRICE_ANIMATION_LABEL')}
      </Text>
      <Bar>
        <ProgressBar variants={variants} initial="enter" animate="animate" exit="enter" />
      </Bar>
    </Space>
  )
}

const PriceLoaderWrapper = styled.div(({ theme }) => ({
  paddingTop: theme.space[7],
}))

const Bar = styled.div(({ theme }) => ({
  height: theme.space[1],
  maxWidth: '16rem',
  marginInline: 'auto',
  backgroundColor: theme.colors.gray500,
  borderRadius: theme.radius.xs,
}))

const ProgressBar = styled(motion.div)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.colors.gray1000,
  borderRadius: theme.radius.xs,
}))

type ShowOfferStateProps = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  onAddedToCart: (item: ProductItemProps) => void
  onClickEdit: () => void
}

const ShowOfferState = (props: ShowOfferStateProps) => {
  const { shopSession, priceIntent, onAddedToCart, onClickEdit } = props
  const { priceTemplate, productData } = useProductPageContext()
  const scrollPastRef = useRef<HTMLDivElement | null>(null)

  const refresh = useRouterRefresh()
  const apolloClient = useApolloClient()
  const formatter = useFormatter()
  const handleAddedToCart = (addedProdutOffer: ProductOfferFragment) => {
    onAddedToCart({
      name: productData.displayNameFull,
      price: formatter.money(addedProdutOffer.price),
    })
    priceIntentServiceInitClientSide(apolloClient).clear(priceTemplate.name, shopSession.id)
    refresh()
  }

  return (
    <SectionWrapper ref={scrollPastRef}>
      <OfferPresenter
        priceIntent={priceIntent}
        shopSession={shopSession}
        scrollPastRef={scrollPastRef}
        onAddedToCart={handleAddedToCart}
        onClickEdit={onClickEdit}
      />
    </SectionWrapper>
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

const OpenModalButtonWrapper = styled.div({
  [mq.lg]: {
    padding: 0,
    maxWidth: PURCHASE_FORM_MAX_WIDTH,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const StickyButtonWrapper = styled.div(({ theme }) => ({
  paddingInline: theme.space[4],
  [mq.lg]: {
    display: 'none',
  },
}))

const SectionWrapper = styled.div({
  width: '100%',
  maxWidth: PURCHASE_FORM_MAX_WIDTH,
  margin: '0 auto',
})

const PriceCalculatorWrapper = styled.div({
  width: '100%',
  maxWidth: PURCHASE_FORM_MAX_WIDTH,
  margin: '0 auto',
})
