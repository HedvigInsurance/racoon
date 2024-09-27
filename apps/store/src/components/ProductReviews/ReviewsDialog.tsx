import { useTranslation } from 'next-i18next'
import { useReducer, useCallback, type ReactElement, type ReactNode } from 'react'
import { Dialog, Text, Space, CrossIcon } from 'ui'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import type { Review, Score } from '@/features/memberReviews/memberReviews.types'
import type { ReviewsDistribution } from '@/features/memberReviews/memberReviews.types'
import type { ReviewsByScore } from '@/features/memberReviews/memberReviews.types'
import { useTracking } from '@/services/Tracking/useTracking'
import { ReviewComment } from './ReviewComment'
import {
  dialogContent,
  dialogCloseBtn,
  dialogWindow,
  reviewComment,
  latestReviewsLabel,
  noReviewsLabel,
} from './ReviewsDialog.css'
import { ReviewsFilter } from './ReviewsFilter'

type Props = {
  children: ReactNode
  reviewsDistribution: ReviewsDistribution
  productIds?: Array<string>
  Header?: ReactElement
  onClose?: () => void
}

export function ReviewsDialog({
  reviewsDistribution,
  children,
  productIds = [],
  Header,
  onClose,
}: Props) {
  const { state, fetchReviews, setSelectedScore } = useReviewsDialog()
  const tracking = useTracking()

  return (
    <Dialog.Root
      onOpenChange={(isOpen) => {
        if (isOpen) {
          fetchReviews(productIds)
          if (productIds.length > 0) {
            tracking.reportOpenProductReviews(productIds[0])
          }
        }
      }}
    >
      <Dialog.Trigger asChild={true}>{children}</Dialog.Trigger>

      {state.status !== 'initial' && (
        <Dialog.Content className={dialogContent} centerContent={true} onClose={onClose}>
          <Dialog.Close className={dialogCloseBtn} onClick={onClose}>
            <CrossIcon size={'1rem'} />
          </Dialog.Close>

          <Dialog.Window className={dialogWindow}>
            <Space y={2}>
              <Dialog.Title>{Header}</Dialog.Title>

              {state.status === 'loading' && <LoadingStateUI />}

              {state.status === 'success' && (
                <SuccessStateUI
                  reviews={state.reviews}
                  reviewsDistribution={reviewsDistribution}
                  selectedScore={state.selectedScore}
                  setSelectedScore={setSelectedScore}
                />
              )}
            </Space>
          </Dialog.Window>
        </Dialog.Content>
      )}
    </Dialog.Root>
  )
}

function LoadingStateUI() {
  return (
    <Space y={2}>
      <Space y={0.25}>
        <Skeleton style={{ height: '3.5rem' }} />
        <Skeleton style={{ height: '3.5rem' }} />
        <Skeleton style={{ height: '3.5rem' }} />
        <Skeleton style={{ height: '3.5rem' }} />
        <Skeleton style={{ height: '3.5rem' }} />
      </Space>
      <Skeleton style={{ height: '12rem' }} />
    </Space>
  )
}

function SuccessStateUI({
  reviews,
  reviewsDistribution,
  selectedScore,
  setSelectedScore,
}: {
  reviews: Array<Review>
  reviewsDistribution: ReviewsDistribution
  selectedScore: Score
  setSelectedScore: (score: Score) => void
}) {
  const { t } = useTranslation('reviews')

  return (
    <Space y={2}>
      <ReviewsFilter
        reviewsDistribution={reviewsDistribution}
        selectedScore={selectedScore}
        onSelectedScoreChange={setSelectedScore}
      />

      {reviews.length > 0 && (
        <>
          <Text
            className={latestReviewsLabel}
            size={{ _: 'xs', sm: 'md' }}
            align="center"
            color="textSecondary"
          >
            {t('LATEST_REVIEWS_WITH_COMMENTS_LABEL')}
          </Text>

          <Space y={{ base: 0.5, md: 1 }}>
            {reviews.map((review) => (
              <ReviewComment key={review.id} className={reviewComment} {...review} />
            ))}
          </Space>
        </>
      )}

      {reviews.length === 0 && (
        <Text
          className={noReviewsLabel}
          size={{ _: 'xs', sm: 'md' }}
          align="center"
          color="textSecondary"
        >
          {t('NO_REVIEWS_LABEL')}
        </Text>
      )}
    </Space>
  )
}

type State =
  | { status: 'initial' }
  | { status: 'loading' }
  | {
      status: 'success'
      selectedScore: Score
      reviews: Array<Review>
      reviewsByScore: ReviewsByScore
    }
  | { status: 'error'; errorMsg?: string }

type Action =
  | { type: 'LOAD_REVIEWS' }
  | {
      type: 'SUCCESS'
      payload: { selectedScore: Score; reviews: Array<Review>; reviewsByScore: ReviewsByScore }
    }
  | { type: 'ERROR'; payload: { errorMsg?: string } }
  | { type: 'SELECT_SCORE'; payload: { score: Score } }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_REVIEWS':
      return { status: 'loading' }
    case 'SUCCESS':
      return {
        status: 'success',
        selectedScore: action.payload.selectedScore,
        reviews: action.payload.reviews,
        reviewsByScore: action.payload.reviewsByScore,
      }
    case 'ERROR':
      return { status: 'error', errorMsg: action.payload.errorMsg }
    case 'SELECT_SCORE':
      if (state.status !== 'success') return state
      return {
        ...state,
        selectedScore: action.payload.score,
        reviews: state.reviewsByScore[action.payload.score].reviews,
      }
    default:
      return state
  }
}

const useReviewsDialog = () => {
  const [state, dispatch] = useReducer(reducer, { status: 'initial' })

  const fetchReviews = useCallback(async (productIds: Array<string>) => {
    try {
      dispatch({ type: 'LOAD_REVIEWS' })

      const urlSearchParams = new URLSearchParams()
      productIds.forEach((id) => urlSearchParams.append('productId', id))

      const searchParams = urlSearchParams.toString() ? `?${urlSearchParams.toString()}` : ''
      const response = await fetch(`/api/member-reviews${searchParams}`)
      if (response.ok) {
        const reviewsByScore = (await response.json()) as ReviewsByScore
        const initialSelectedScore = getInitialSelectedScore(reviewsByScore)

        dispatch({
          type: 'SUCCESS',
          payload: {
            selectedScore: initialSelectedScore,
            reviews: reviewsByScore[initialSelectedScore].reviews,
            reviewsByScore,
          },
        })
      } else {
        dispatch({ type: 'ERROR', payload: { errorMsg: 'Failed to fetch reviews.' } })
      }
    } catch (error) {
      console.log(error)
      dispatch({ type: 'ERROR', payload: { errorMsg: 'Failed to fetch reviews.' } })
    }
  }, [])

  const setSelectedScore = useCallback((score: Score) => {
    dispatch({ type: 'SELECT_SCORE', payload: { score } })
  }, [])

  return {
    state,
    fetchReviews,
    setSelectedScore,
  }
}

const getInitialSelectedScore = (reviewsByScore: ReviewsByScore | null): Score => {
  const defaultScore: Score = 5

  const scores: Array<Score> = [5, 4, 3, 2, 1]
  const initialSelectedScore = reviewsByScore
    ? scores.find((score) => reviewsByScore[score].reviews.length)
    : undefined

  return initialSelectedScore ?? defaultScore
}
