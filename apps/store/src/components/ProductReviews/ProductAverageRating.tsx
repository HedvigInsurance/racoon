import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { CertifiedIcon } from 'ui'
import type { ProductData } from '@/components/ProductData/ProductData.types'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { ReviewsDialog } from '@/components/ProductReviews/ReviewsDialog'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useProuctReviewsMetadata } from '@/features/memberReviews/ProductReviewsMetadataProvider'
import { sendDialogEvent } from '@/utils/dialogEvent'
import { Features } from '@/utils/Features'
import { useFormatter } from '@/utils/useFormatter'
import { AverageRating } from './AverageRating'
import { wrapper, trigger, certifiedIcon, disclaimerText } from './ProductAverageRating.css'
import { ReviewsDiclaimer } from './ReviewsDisclaimer'
import { ReviewsDistributionDialog } from './ReviewsDistributionDialog'

export const ProductAverageRating = () => {
  const { t } = useTranslation('reviews')
  const { numberGrouping } = useFormatter()
  const productData = useProductData()
  const productReviewsMetadata = useProuctReviewsMetadata()

  if (!productReviewsMetadata) {
    console.log(
      `ProductAverageRating | No product reviews metadata found for product ${productData.name}`,
    )
    return null
  }

  const openDialog = () => {
    // Notify that playing media should be paused as a result of the dialog being opened
    sendDialogEvent('open')
  }

  const closeDialog = () => {
    // Notify that all media paused as a result of the dialog being opened should be resumed
    sendDialogEvent('close')
  }

  const { averageRating, reviewsDistribution } = productReviewsMetadata

  const Trigger = (
    <button className={trigger} onClick={openDialog}>
      {t('REVIEWS_COUNT_LABEL', {
        count: averageRating.totalOfReviews,
        reviewsCount: numberGrouping(averageRating.totalOfReviews),
      })}
    </button>
  )

  const Header = (
    <section>
      <AverageRating size={{ _: 9, sm: 11 }} score={averageRating.score} maxScore={MAX_SCORE} />
      <ReviewsDiclaimer
        className={disclaimerText}
        size={{ _: 'xs', sm: 'md' }}
        reviewsCount={averageRating.totalOfReviews}
      />
    </section>
  )

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
        <CertifiedIcon className={certifiedIcon} size="1.15rem" />

        {Features.enabled('HIDE_REVIEWS_FROM_PRODUCT_AVERAGE_RATING') ? (
          <ReviewsDistributionDialog
            Header={Header}
            reviewsDistribution={reviewsDistribution}
            onClose={closeDialog}
          >
            {Trigger}
          </ReviewsDistributionDialog>
        ) : (
          <ReviewsDialog
            productIds={[productData.name]}
            Header={Header}
            reviewsDistribution={reviewsDistribution}
            onClose={closeDialog}
          >
            {Trigger}
          </ReviewsDialog>
        )}
      </div>
    </>
  )
}

type AverageRating = NonNullable<ReturnType<typeof useProuctReviewsMetadata>>['averageRating']

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
