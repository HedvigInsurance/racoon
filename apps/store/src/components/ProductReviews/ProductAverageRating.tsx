import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { CertifiedIcon } from 'ui'
import { ProductData } from '@/components/ProductData/ProductData.types'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { ReviewsDialog } from '@/components/ProductReviews/ReviewsDialog'
import { useReviews } from '@/components/ProductReviews/useReviews'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useProuctReviewsDataContext } from '@/features/memberReviews/ProductReviewsDataProvider'
import { sendDialogEvent } from '@/utils/dialogEvent'
import { useFormatter } from '@/utils/useFormatter'
import { AverageRating } from './AverageRating'
import { wrapper, trigger, certifiedIcon } from './ProductAverageRating.css'
import { ReviewsDiclaimer } from './ReviewsDisclaimer'

export const ProductAverageRating = () => {
  const { t } = useTranslation('reviews')
  const { numberGrouping } = useFormatter()
  const productReviewsData = useProuctReviewsDataContext()
  const productData = useProductData()

  const openDialog = () => {
    // Notify that playing media should be paused as a result of the dialog being opened
    sendDialogEvent('open')
  }

  const averageRating = productReviewsData?.averageRating
  if (!averageRating) {
    console.log(`ProductAverageRating | No reviews data found for product ${productData.name}`)
    return null
  }

  return (
    <>
      <Head>
        <script
          key="product-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getProductStructuredData(productData, averageRating)),
          }}
        />
      </Head>

      <div className={wrapper}>
        <CertifiedIcon className={certifiedIcon} size="1rem" />

        <Dialog>
          <button className={trigger} onClick={openDialog}>
            {t('REVIEWS_COUNT_LABEL', {
              count: averageRating.totalOfReviews,
              reviewsCount: numberGrouping(averageRating.totalOfReviews),
            })}
          </button>
        </Dialog>
      </div>
    </>
  )
}

type DialogProps = {
  children: ReactNode
}

const Dialog = (props: DialogProps) => {
  const productReviewsData = useProuctReviewsDataContext()
  const { rating, reviews, reviewsDistribution, selectedScore, setSelectedScore } =
    useReviews(productReviewsData)

  const closeDialog = () => {
    // Notify that all media paused as a result of the dialog being opened should be resumed
    sendDialogEvent('close')
  }

  if (!rating) return null

  return (
    <ReviewsDialog
      Header={
        <section>
          <AverageRating size={{ _: 9, sm: 11 }} score={rating.score} maxScore={MAX_SCORE} />
          <ReviewsDiclaimer size={{ _: 'xs', sm: 'md' }} reviewsCount={rating.totalOfReviews} />
        </section>
      }
      reviews={reviews}
      reviewsDistribution={reviewsDistribution}
      selectedScore={selectedScore}
      onSelectedScoreChange={setSelectedScore}
      onClose={closeDialog}
    >
      {props.children}
    </ReviewsDialog>
  )
}

type AverageRating = NonNullable<ReturnType<typeof useProuctReviewsDataContext>>['averageRating']

const getProductStructuredData = (product: ProductData, averageRating: AverageRating) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.displayNameFull,
    description: product.tagline,
    brand: {
      '@type': 'Brand',
      name: 'Hedvig',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating.score,
      bestRating: MAX_SCORE,
      reviewCount: averageRating.totalOfReviews,
    },
  }
}
