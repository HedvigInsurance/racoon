import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { motion, Variants } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { ReactNode, useRef, useState } from 'react'
import { Button, Heading, mq, Space, Text, theme, useBreakpoint } from 'ui'
import { CartToast, CartToastAttributes } from '@/components/CartNotification/CartToast'
import { ProductItemProps } from '@/components/CartNotification/ProductItem'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
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
import { TrackingContextKey } from '@/services/Tracking/Tracking'
import { useTracking } from '@/services/Tracking/useTracking'
import { sendDialogEvent } from '@/utils/dialogEvent'
import { useFormatter } from '@/utils/useFormatter'
import { ScrollPast } from '../ScrollPast/ScrollPast'
import { CircledHSuperscript } from './CircledHSuperscript'
import { OfferPresenter } from './OfferPresenter'
import { PriceCalculatorDialog } from './PriceCalculatorDialog'
import { PURCHASE_FORM_MAX_WIDTH } from './PurchaseForm.constants'

type FormState = 'IDLE' | 'EDIT' | 'ERROR'

export const PurchaseForm = () => {
  const { t } = useTranslation('purchase-form')
  const [formState, setFormState] = useState<FormState>('IDLE')
  const { priceTemplate, productData } = useProductPageContext()
  const { shopSession } = useShopSession()
  const apolloClient = useApolloClient()
  const formatter = useFormatter()
  const [{ priceIntent }, setupPriceIntent] = usePriceIntent()
  const tracking = useTracking()
  const isLarge = useBreakpoint('lg')

  const editForm = () => {
    setFormState('EDIT')
    if (!isLarge) {
      sendDialogEvent('open')
    }
  }
  const handleOpen = () => {
    tracking.reportOpenPriceCalculator({
      id: productData.id,
      displayNameFull: productData.displayNameFull,
    })
    editForm()
  }

  return (
    <Layout pillowSize={formState === 'EDIT' ? 'small' : 'large'}>
      {(notifyProductAdded) => {
        if (!shopSession || !priceIntent) return <PendingState />

        if (formState !== 'IDLE') {
          return (
            <>
              <EditingState
                shopSession={shopSession}
                priceIntent={priceIntent}
                onToggleDialog={() => setFormState('IDLE')}
                onComplete={(success) => setFormState(success ? 'IDLE' : 'ERROR')}
              />
              <FullscreenDialog.Root
                open={formState === 'ERROR'}
                onOpenChange={() => setFormState('IDLE')}
              >
                <FullscreenDialog.Modal
                  center
                  Footer={
                    <>
                      <Button type="button" onClick={editForm}>
                        {t('GENERAL_ERROR_DIALOG_PRIMARY_BUTTON')}
                      </Button>
                      <FullscreenDialog.Close asChild>
                        <Button type="button" variant="ghost">
                          {t('DIALOG_BUTTON_CANCEL')}
                        </Button>
                      </FullscreenDialog.Close>
                    </>
                  }
                >
                  <Text size={{ _: 'lg', lg: 'xl' }} align="center">
                    {t('GENERAL_ERROR_DIALOG_PROMPT')}
                  </Text>
                </FullscreenDialog.Modal>
              </FullscreenDialog.Root>
            </>
          )
        }

        if (priceIntent.offers.length > 0) {
          const handleAddedToCart = async (item: ProductOfferFragment) => {
            notifyProductAdded({
              name: productData.displayNameFull,
              price: formatter.monthlyPrice(item.price),
              /* @TODO: display "automatically switches" if cancellation is requested" */
              startDate: formatter.fromNow(new Date(item.startDate)),
            })

            const service = priceIntentServiceInitClientSide(apolloClient)
            service.clear(priceTemplate.name, shopSession.id)
            try {
              await setupPriceIntent(shopSession)
            } catch (error) {
              datadogLogs.logger.error('Failed to create new price intent', {
                error,
                priceTemplate: priceTemplate.name,
                shopSessionId: shopSession.id,
              })
            }
          }

          return (
            <ShowOfferState
              shopSession={shopSession}
              priceIntent={priceIntent}
              onAddedToCart={handleAddedToCart}
              onClickEdit={editForm}
            />
          )
        }

        return <IdleState onClick={handleOpen} />
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
              size={pillowSize === 'large' ? 'xxlarge' : 'large'}
              {...productData.pillowImage}
            />
            <Space y={0.5}>
              <Heading as="h1" variant="standard.24" align="center">
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
        <Button loading disabled>
          {t('OPEN_PRICE_CALCULATOR_BUTTON')}
        </Button>
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
          {button}
        </Space>
      </SectionWrapper>
      <ScrollPast targetRef={ref}>
        <StickyButtonWrapper>{button}</StickyButtonWrapper>
      </ScrollPast>
    </>
  )
}

type EditingStateProps = {
  shopSession: ShopSession
  priceIntent: PriceIntent
  onToggleDialog: (open: boolean) => void
  onComplete: (success: boolean) => void
}

const EditingState = (props: EditingStateProps) => {
  const { onToggleDialog, shopSession, priceIntent, onComplete } = props
  const { productData } = useProductPageContext()
  const isLarge = useBreakpoint('lg')
  const tracking = useTracking()

  const [confirmPriceIntent, result] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: priceIntent.id },
    onError(error) {
      datadogLogs.logger.error('Failed to confirm price intent', {
        error,
        priceIntentId: priceIntent.id,
      })
      onComplete(false)
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
        onComplete(true)
      } else {
        setIsLoadingPrice(false)
      }
    } catch (error) {
      // Error is already handled in onError callback
      console.debug('Error confirming price intent', error)
    }
  }

  const content = isLoadingPrice ? (
    <PriceLoaderWrapper>
      <PriceLoader />
    </PriceLoaderWrapper>
  ) : (
    <PriceCalculatorWrapper>
      <PriceCalculator
        priceIntent={priceIntent}
        shopSession={shopSession}
        onConfirm={handleConfirm}
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
  onAddedToCart: (item: ProductOfferFragment) => void
  onClickEdit: () => void
}

const ShowOfferState = (props: ShowOfferStateProps) => {
  const { shopSession, priceIntent, onAddedToCart, onClickEdit } = props
  const scrollPastRef = useRef<HTMLDivElement | null>(null)

  return (
    <SectionWrapper ref={scrollPastRef}>
      <OfferPresenter
        priceIntent={priceIntent}
        shopSession={shopSession}
        scrollPastRef={scrollPastRef}
        onAddedToCart={onAddedToCart}
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
  paddingTop: '3vw',
  paddingBottom: theme.space.xxl,
  paddingInline: theme.space.md,

  [mq.xl]: {
    paddingTop: '6vw',
  },
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

const PriceCalculatorWrapper = styled.div({
  width: '100%',
  [mq.sm]: {
    maxWidth: PURCHASE_FORM_MAX_WIDTH,
    margin: '0 auto',
  },
})
