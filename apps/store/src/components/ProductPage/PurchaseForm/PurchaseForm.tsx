'use client'
import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { memo, type ReactNode } from 'react'
import { useMemo } from 'react'
import { Suspense } from 'react'
import { useCallback, useRef, useState } from 'react'
import { Button, framerTransitions, Space } from 'ui'
import type { CartToastAttributes } from '@/components/CartNotification/CartToast'
import { CartToast } from '@/components/CartNotification/CartToast'
import { PriceCalculatorDynamic } from '@/components/PriceCalculator/PriceCalculatorDynamic'
import { completePriceLoader, PriceLoader } from '@/components/PriceLoader'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { PriceIntentTrackingProvider } from '@/components/ProductPage/PriceIntentTrackingProvider'
import { useProductPageData } from '@/components/ProductPage/ProductPageDataProvider'
import { ProductPageDebugDialog } from '@/components/ProductPage/ProductPageDebugDialog'
import { ProductPageViewTracker } from '@/components/ProductPage/ProductPageViewTrack'
import {
  useIsPriceIntentStateReady,
  usePriceIntentId,
  useSyncPriceIntentState,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import {
  purchaseFormHeroWrapper,
  purchaseFormPriceLoaderWrapper,
  purchaseFormResponsiveBlock,
  purchaseFormSection,
  purchaseFormStickyButtonWrapper,
  purchaseFormTop,
} from '@/components/ProductPage/PurchaseForm/PurchaseForm.css'
import {
  useIsPriceCalculatorExpanded,
  useOpenPriceCalculatorQueryParam,
} from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { usePreloadedPriceIntentId } from '@/components/ProductPage/PurchaseForm/usePreloadedPriceIntentId'
import { ProductAverageRating } from '@/components/ProductReviews/ProductAverageRating'
import { BankSigneringEvent } from '@/services/bankSignering'
import type { ProductOfferFragment } from '@/services/graphql/generated'
import {
  ExternalInsuranceCancellationOption,
  usePriceIntentConfirmMutation,
} from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { sendDialogEvent } from '@/utils/dialogEvent'
import { useBreakpoint } from '@/utils/useBreakpoint/useBreakpoint'
import { ScrollPast } from '../ScrollPast/ScrollPast'
import { loadOfferPresenter, OfferPresenterDynamic } from './OfferPresenterDynamic'
import { PriceCalculatorDialog } from './PriceCalculatorDialog'
import { ProductHero } from './ProductHero/ProductHero'
import { PurchaseFormErrorDialog } from './PurchaseFormErrorDialog'
import { usePurchaseFormState } from './usePurchaseFormState'
import { useSelectedOffer } from './useSelectedOffer'

export type PurchaseFormProps = {
  showAverageRating?: boolean
}

export function PurchaseForm(props: PurchaseFormProps) {
  const pathname = usePathname()

  const toastRef = useRef<CartToastAttributes | null>(null)
  const notifyProductAdded = () => {
    toastRef.current?.show()
  }

  return (
    <>
      <div className={purchaseFormTop}>
        <Suspense
          fallback={<IdleState loading={true} showAverageRating={props.showAverageRating} />}
        >
          <PriceIntentTrackingProvider>
            <PurchaseFormInner {...props} notifyProductAdded={notifyProductAdded} />
            <ProductPageDebugDialog />
            <ProductPageViewTracker />
          </PriceIntentTrackingProvider>
        </Suspense>
      </div>
      {/* key=pathname makes sure we re-init the toast if current page changes */}
      <CartToast key={pathname} ref={toastRef} />
    </>
  )
}

type PurchaseFormInnerProps = PurchaseFormProps & {
  notifyProductAdded: (item: ProductOfferFragment) => void
}

const PurchaseFormInner = (props: PurchaseFormInnerProps) => {
  const productData = useProductData()
  const { shopSession } = useShopSession()
  const [selectedOffer] = useSelectedOffer()
  const tracking = useTracking()
  const isLarge = useBreakpoint('lg')

  const preloadedPriceIntentId = usePreloadedPriceIntentId()
  useSyncPriceIntentState(preloadedPriceIntentId)

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

  const handleComplete = useCallback(
    (error?: string) => {
      setFormState(error != null ? { state: 'ERROR', errorMsg: error } : 'IDLE')
      !isLarge && window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    },
    [isLarge, setFormState],
  )

  const isPriceIntentStateReady = useIsPriceIntentStateReady()

  const isReady = shopSession != null && isPriceIntentStateReady
  if (!isReady) {
    return <IdleState loading={true} showAverageRating={props.showAverageRating} />
  } else if (formState.state === 'IDLE') {
    if (selectedOffer == null) {
      return <IdleState onClick={handleOpen} showAverageRating={props.showAverageRating} />
    } else {
      return (
        <ProductHeroContainer size="large" compact={true}>
          <ShowOfferState onClickEdit={editForm} notifyProductAdded={props.notifyProductAdded} />
        </ProductHeroContainer>
      )
    }
  }

  const editingStateForm = <EditingState onComplete={handleComplete} />

  const editor = isLarge ? (
    <motion.div
      initial={{ opacity: 0, y: '1vh' }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ...framerTransitions.easeInOutCubic }}
    >
      <ProductHeroContainer size="small" compact={true}>
        {editingStateForm}
      </ProductHeroContainer>
    </motion.div>
  ) : (
    <PriceCalculatorDialog isOpen toggleDialog={() => setFormState('IDLE')}>
      {editingStateForm}
    </PriceCalculatorDialog>
  )

  return (
    <>
      {formState.state !== 'ERROR' && editor}

      <PurchaseFormErrorDialog
        open={formState.state === 'ERROR'}
        onOpenChange={() => {
          setFormState('IDLE')
        }}
        onEditClick={editForm}
        errorMessage={formState.errorMsg}
      />
    </>
  )
}

type ProductHeroContainerProps = {
  children: ReactNode
  size: 'small' | 'large'
  compact?: boolean
}

const ProductHeroContainer = (props: ProductHeroContainerProps) => {
  const { product } = useProductPageData()
  const productData = useProductData()
  const pillow = useMemo(
    () => ({
      src: productData.pillowImage.src,
      alt: productData.pillowImage.alt ?? undefined,
    }),
    [productData],
  )
  return (
    <div
      className={clsx(
        purchaseFormResponsiveBlock,
        purchaseFormSection,
        purchaseFormHeroWrapper.base,
        props.compact ? purchaseFormHeroWrapper.compact : purchaseFormHeroWrapper.full,
      )}
    >
      <ProductHero
        name={product.name}
        description={product.description}
        pillow={pillow}
        size={props.size}
      />
      {props.children}
    </div>
  )
}

type IdleStateProps = { loading?: boolean; onClick?: () => void } & Pick<
  PurchaseFormProps,
  'showAverageRating'
>

const IdleState = ({ loading, onClick, showAverageRating }: IdleStateProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('purchase-form')

  return (
    <>
      <div ref={ref}>
        <ProductHeroContainer size="large">
          <Space y={1}>
            <Button loading={loading} onClick={onClick} fullWidth={true}>
              {t('OPEN_PRICE_CALCULATOR_BUTTON')}
            </Button>
            {showAverageRating && <ProductAverageRating />}
          </Space>
        </ProductHeroContainer>
      </div>
      <ScrollPast targetRef={ref}>
        <div className={purchaseFormStickyButtonWrapper}>
          <Button onClick={onClick} fullWidth={true}>
            {t('OPEN_PRICE_CALCULATOR_BUTTON')}
          </Button>
        </div>
      </ScrollPast>
    </>
  )
}

type EditingStateProps = {
  onComplete: (error?: string) => void
}

const EditingState = memo((props: EditingStateProps) => {
  const priceIntentId = usePriceIntentId()
  const { onComplete } = props
  const { t } = useTranslation('purchase-form')

  const priceLoaderPromise = useRef<Promise<unknown> | null>(null)
  const [confirmPriceIntent, result] = usePriceIntentConfirmMutation({
    variables: { priceIntentId },
    onError(error) {
      datadogLogs.logger.warn('Failed to confirm price intent', {
        error,
        priceIntentId,
      })
      if (error.networkError || error.graphQLErrors.length > 0) {
        // Unknown error
        onComplete(t('GENERAL_ERROR_DIALOG_PROMPT'))
      } else {
        // User error
        onComplete(error.message)
      }
    },
    async onCompleted(data) {
      const updatedPriceIntent = data.priceIntentConfirm.priceIntent
      if (updatedPriceIntent) {
        const hasBankSigneringOffer = updatedPriceIntent.offers.some(
          (item) => item.cancellation.option === ExternalInsuranceCancellationOption.Banksignering,
        )
        if (hasBankSigneringOffer) {
          datadogRum.addAction(BankSigneringEvent.Offered)
        }
        await priceLoaderPromise.current
        onComplete()
      } else {
        throw new Error(
          `UNEXPECTED: price intent not updated without user error (${priceIntentId})`,
        )
      }
    },
  })

  const [isLoadingPrice, setIsLoadingPrice] = useState(result.loading)
  const handleConfirm = useCallback(() => {
    setIsLoadingPrice(true)
    confirmPriceIntent()
    priceLoaderPromise.current = Promise.all([
      completePriceLoader(),
      // Make sure we finish loading next step's UI before hiding loading indicator
      loadOfferPresenter(),
    ])
  }, [confirmPriceIntent])

  if (isLoadingPrice) {
    return (
      <div className={purchaseFormPriceLoaderWrapper}>
        <PriceLoader />
      </div>
    )
  }
  return (
    <div className={purchaseFormResponsiveBlock}>
      <PriceCalculatorDynamic key={priceIntentId} onConfirm={handleConfirm} />
    </div>
  )
})
EditingState.displayName = 'EditingState'

type ShowOfferStateProps = {
  onClickEdit: () => void
  notifyProductAdded: (item: ProductOfferFragment) => void
}

const ShowOfferState = (props: ShowOfferStateProps) => {
  const { onClickEdit, notifyProductAdded } = props
  const scrollPastRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className={clsx(purchaseFormResponsiveBlock, purchaseFormSection)} ref={scrollPastRef}>
      <OfferPresenterDynamic
        scrollPastRef={scrollPastRef}
        onClickEdit={onClickEdit}
        notifyProductAdded={notifyProductAdded}
      />
    </div>
  )
}
