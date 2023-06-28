import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { motion, Variants } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useRef, useState } from 'react'
import { Balancer } from 'react-wrap-balancer'
import { Button, Heading, mq, Space, Text, theme, useBreakpoint, WarningTriangleIcon } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { ProductItemProps } from '@/components/CartNotification/ProductItem'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { Pillow } from '@/components/Pillow/Pillow'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { usePriceIntent } from '@/components/ProductPage/PriceIntentContext'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import {
  useIsPriceCalculatorExpanded,
  useOpenPriceCalculatorQueryParam,
} from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  ExternalInsuranceCancellationOption,
  ProductOfferFragment,
  usePriceIntentConfirmMutation,
} from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { TrackingContextKey } from '@/services/Tracking/Tracking'
import { useTracking } from '@/services/Tracking/useTracking'
import { sendDialogEvent } from '@/utils/dialogEvent'
import { useFormatter } from '@/utils/useFormatter'
import { ScrollPast } from '../ScrollPast/ScrollPast'
import { OfferPresenter } from './OfferPresenter'
import { PriceCalculatorDialog } from './PriceCalculatorDialog'
import { ProductHero } from './ProductHero/ProductHero'
import { PURCHASE_FORM_MAX_WIDTH } from './PurchaseForm.constants'
import { usePurchaseFormState } from './usePurchaseFormState'
import { useSelectedOffer } from './useSelectedOffer'

export const PurchaseForm = () => {
  const { t } = useTranslation('purchase-form')
  const { priceTemplate, productData } = useProductPageContext()
  const { shopSession } = useShopSession()
  const formatter = useFormatter()
  const [priceIntent, , createNewPriceIntent] = usePriceIntent()
  const [selectedOffer] = useSelectedOffer()
  const tracking = useTracking()
  const isLarge = useBreakpoint('lg')
  const router = useRouter()

  const isPriceCalculatorExpanded = useIsPriceCalculatorExpanded()
  const [formState, setFormState] = usePurchaseFormState(
    isPriceCalculatorExpanded ? { state: 'EDIT' } : undefined,
  )

  const editForm = useCallback(() => {
    setFormState('EDIT')
    if (!isLarge) {
      sendDialogEvent('open')
    }
  }, [isLarge, setFormState])

  const handleQueryParamDetected = useCallback(() => {
    tracking.reportOpenPriceCalculator({
      id: productData.id,
      displayNameFull: productData.displayNameFull,
    })

    editForm()
  }, [productData.id, productData.displayNameFull, tracking, editForm])

  useOpenPriceCalculatorQueryParam({
    onQueryParamDetected: handleQueryParamDetected,
  })

  const handleOpen = () => {
    tracking.reportOpenPriceCalculator({
      id: productData.id,
      displayNameFull: productData.displayNameFull,
    })
    editForm()
  }

  const handleComplete = (error?: string) => {
    setFormState(error != null ? { state: 'ERROR', errorMsg: error } : 'IDLE')
    !isLarge && window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  return (
    <Layout>
      {(notifyProductAdded) => {
        if (!shopSession || !priceIntent)
          return (
            <ProductHeroContainer size="large">
              <Button loading={true} />
            </ProductHeroContainer>
          )

        if (formState.state !== 'IDLE') {
          const editingStateForm = (
            <EditingState
              shopSession={shopSession}
              priceIntent={priceIntent}
              onComplete={handleComplete}
            />
          )

          return (
            <>
              {formState.state !== 'ERROR' && !isLarge ? (
                <PriceCalculatorDialog
                  isOpen
                  toggleDialog={() => setFormState('IDLE')}
                  header={
                    <SpaceFlex direction="vertical" align="center" space={0.5}>
                      <Pillow size="large" {...productData.pillowImage} />
                      <Heading as="h2" variant="standard.18">
                        {productData.displayNameShort}
                      </Heading>
                    </SpaceFlex>
                  }
                >
                  {editingStateForm}
                </PriceCalculatorDialog>
              ) : (
                <ProductHeroContainer size="small" compact={true}>
                  {editingStateForm}
                </ProductHeroContainer>
              )}

              <FullscreenDialog.Root
                open={formState.state === 'ERROR'}
                onOpenChange={() => {
                  setFormState('IDLE')
                }}
              >
                <FullscreenDialog.Modal
                  center={true}
                  Footer={
                    <>
                      <Button type="button" onClick={editForm}>
                        {t('GENERAL_ERROR_DIALOG_PRIMARY_BUTTON')}
                      </Button>
                      <FullscreenDialog.Close asChild={true}>
                        <Button type="button" variant="ghost">
                          {t('DIALOG_BUTTON_CANCEL', { ns: 'common' })}
                        </Button>
                      </FullscreenDialog.Close>
                    </>
                  }
                >
                  <GridLayout.Root>
                    <GridLayout.Content width="1/3" align="center">
                      <SpaceFlex direction="vertical" align="center" space={0}>
                        <Text size={{ _: 'lg', lg: 'xl' }}>
                          <SpaceFlex space={0.25} align="center">
                            <WarningTriangleIcon
                              size="1em"
                              color={theme.colors.signalAmberElement}
                            />
                            {t('GENERAL_ERROR_DIALOG_TITLE', { ns: 'common' })}
                          </SpaceFlex>
                        </Text>
                        <Balancer ratio={0.5}>
                          <Text size={{ _: 'lg', lg: 'xl' }} align="center" color="textSecondary">
                            {formState.state === 'ERROR' && formState.errorMsg
                              ? formState.errorMsg
                              : t('GENERAL_ERROR_DIALOG_PROMPT')}
                          </Text>
                        </Balancer>
                      </SpaceFlex>
                    </GridLayout.Content>
                  </GridLayout.Root>
                </FullscreenDialog.Modal>
              </FullscreenDialog.Root>
            </>
          )
        }

        if (selectedOffer) {
          const handleAddedToCart = async (item: ProductOfferFragment, nextUrl?: string) => {
            try {
              await createNewPriceIntent(shopSession)
            } catch (error) {
              datadogLogs.logger.error('Failed to create new price intent', {
                error,
                priceTemplate: priceTemplate.name,
                shopSessionId: shopSession.id,
              })
              console.error('Failed to create new price intent', error)
            }

            if (nextUrl) {
              return await router.push(nextUrl)
            }

            notifyProductAdded({
              name: productData.displayNameFull,
              price: formatter.monthlyPrice(item.price),
              pillowSrc: productData.pillowImage.src,
              description:
                !item.cancellation.requested ||
                item.cancellation.option ===
                  ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate
                  ? t('CART_ENTRY_DATE_LABEL', {
                      date: formatter.fromNow(new Date(item.startDate)),
                      ns: 'cart',
                    })
                  : t('CART_ENTRY_AUTO_SWITCH', { ns: 'cart' }),
            })
          }

          return (
            <ProductHeroContainer size="large" compact={true}>
              <ShowOfferState
                shopSession={shopSession}
                priceIntent={priceIntent}
                onAddedToCart={handleAddedToCart}
                onClickEdit={editForm}
                selectedOffer={selectedOffer}
              />
            </ProductHeroContainer>
          )
        }

        return <IdleState onClick={handleOpen} />
      }}
    </Layout>
  )
}

type LayoutProps = {
  children: (notifyProductAdded: (item: ProductItemProps) => void) => ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const toastRef = useRef<CartToastAttributes | null>(null)
  const notifyProductAdded = (item: ProductItemProps) => {
    toastRef.current?.publish(item)
  }

  return (
    <>
      <PurchaseFormTop>{children(notifyProductAdded)}</PurchaseFormTop>
      <CartToast ref={toastRef} />
    </>
  )
}

type ProductHeroContainerProps = {
  children: ReactNode
  size: 'small' | 'large'
  compact?: boolean
}

const ProductHeroContainer = (props: ProductHeroContainerProps) => {
  const { content, productData } = useProductPageContext()

  return (
    <ProductHeroWrapper compact={props.compact ?? false}>
      <ProductHero
        name={content.product.name}
        description={content.product.description}
        pillow={{
          src: productData.pillowImage.src,
          alt: productData.pillowImage.alt ?? undefined,
        }}
        size={props.size}
      />
      {props.children}
    </ProductHeroWrapper>
  )
}

type IdleStateProps = { onClick: () => void }

const IdleState = ({ onClick }: IdleStateProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('purchase-form')

  return (
    <>
      <div ref={ref}>
        <ProductHeroContainer size="large">
          <Button onClick={onClick}>{t('OPEN_PRICE_CALCULATOR_BUTTON')}</Button>
        </ProductHeroContainer>
      </div>
      <ScrollPast targetRef={ref}>
        <StickyButtonWrapper>
          <Button onClick={onClick}>{t('OPEN_PRICE_CALCULATOR_BUTTON')}</Button>
        </StickyButtonWrapper>
      </ScrollPast>
    </>
  )
}

type EditingStateProps = {
  shopSession: ShopSession
  priceIntent: PriceIntent
  onComplete: (error?: string) => void
}

const EditingState = (props: EditingStateProps) => {
  const { shopSession, priceIntent, onComplete } = props
  const tracking = useTracking()

  const [confirmPriceIntent, result] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: priceIntent.id },
    onError(error) {
      datadogLogs.logger.error('Failed to confirm price intent', {
        error,
        priceIntentId: priceIntent.id,
      })
      onComplete(error.message)
    },
  })
  const [isLoadingPrice, setIsLoadingPrice] = useState(result.loading)

  const handleConfirm = async () => {
    setIsLoadingPrice(true)

    try {
      const [{ data }] = await Promise.all([confirmPriceIntent(), completePriceLoader()])
      const updatedPriceIntent = data?.priceIntentConfirm.priceIntent
      if (updatedPriceIntent) {
        tracking.setContext(TrackingContextKey.Customer, shopSession.customer)
        tracking.setPriceIntentContext(updatedPriceIntent)
        updatedPriceIntent.offers.forEach((offer) => tracking.reportOfferCreated(offer))
        onComplete()
      } else {
        setIsLoadingPrice(false)
      }
    } catch (error) {
      // Error is already handled in onError callback
      console.debug('Error confirming price intent', error)
    }
  }

  return isLoadingPrice ? (
    <PriceLoaderWrapper>
      <PriceLoader />
    </PriceLoaderWrapper>
  ) : (
    <PriceCalculatorWrapper>
      <PriceCalculator
        key={priceIntent.id}
        priceIntent={priceIntent}
        shopSession={shopSession}
        onConfirm={handleConfirm}
      />
    </PriceCalculatorWrapper>
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

const PriceLoaderWrapper = styled.div({
  paddingTop: theme.space.xxl,
})

const Bar = styled.div({
  height: theme.space.xxs,
  maxWidth: '16rem',
  marginInline: 'auto',
  backgroundColor: theme.colors.gray500,
  borderRadius: theme.radius.xs,
})

const ProgressBar = styled(motion.div)({
  height: '100%',
  backgroundColor: theme.colors.gray1000,
  borderRadius: theme.radius.xs,
})

type ShowOfferStateProps = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  onAddedToCart: (item: ProductOfferFragment, nextUrl?: string) => void
  onClickEdit: () => void
  selectedOffer: ProductOfferFragment
}

const ShowOfferState = (props: ShowOfferStateProps) => {
  const { shopSession, priceIntent, selectedOffer, onAddedToCart, onClickEdit } = props
  const scrollPastRef = useRef<HTMLDivElement | null>(null)

  return (
    <SectionWrapper ref={scrollPastRef}>
      <OfferPresenter
        priceIntent={priceIntent}
        shopSession={shopSession}
        scrollPastRef={scrollPastRef}
        onAddedToCart={onAddedToCart}
        onClickEdit={onClickEdit}
        selectedOffer={selectedOffer}
      />
    </SectionWrapper>
  )
}

const PurchaseFormTop = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.space.xl,
  minHeight: '80vh',
  paddingInline: theme.space.md,
  paddingBottom: theme.space.xl,

  [mq.lg]: { minHeight: 'revert' },
})

const StickyButtonWrapper = styled.div({
  paddingInline: theme.space.md,
  [mq.lg]: {
    display: 'none',
  },
})

const SectionWrapper = styled.div({
  position: 'relative',
  width: '100%',
  [mq.sm]: {
    maxWidth: PURCHASE_FORM_MAX_WIDTH,
    margin: '0 auto',
  },
})

const ProductHeroWrapper = styled(SectionWrapper)<{ compact: boolean }>(
  {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  ({ compact }) => ({
    rowGap: compact ? theme.space.xl : theme.space[9],
  }),
)

const PriceCalculatorWrapper = styled.div({
  width: '100%',
  [mq.sm]: {
    maxWidth: PURCHASE_FORM_MAX_WIDTH,
    margin: '0 auto',
  },
})
