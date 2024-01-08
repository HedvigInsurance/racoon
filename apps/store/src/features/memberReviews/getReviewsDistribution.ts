import type { Score } from './memberReviews.types'
import type { ReviewsDistribution, ScoreDistributionTuple } from './memberReviews.types'

type CountByScoreTuple = [Score, number]

export type ReviewsCountByScore = Array<CountByScoreTuple>

// It uses Largest Remainder Method (LRM) to round the percetages
// https://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
export const getReviewsDistribution = (reviewsCountByScore: ReviewsCountByScore) => {
  const totalOfReviews = getTotalOfReviews(reviewsCountByScore)

  const realReviewsDistribution: ReviewsDistribution = reviewsCountByScore.map(([score, total]) => {
    const percentage = totalOfReviews > 0 ? (total / totalOfReviews) * 100 : 0

    return [score, percentage]
  })

  const truncatedReviewsDistribution: ReviewsDistribution = realReviewsDistribution.map(
    ([score, percentage]) => {
      const roundedPercentage = Math.trunc(percentage)
      return [score, roundedPercentage]
    },
  )

  const truncatedPercentagesTotal = truncatedReviewsDistribution.reduce(
    (acc, [, percentage]) => acc + percentage,
    0,
  )
  const pointsToBeDistributed = truncatedPercentagesTotal > 0 ? 100 - truncatedPercentagesTotal : 0

  const scoresThatShouldReceiveExtraPoint = [...realReviewsDistribution]
    .sort(sortReviewsDistributionByDecimals)
    .map(([score]) => score)
    .splice(0, pointsToBeDistributed)

  const roundedReviewsDistribution: ReviewsDistribution = truncatedReviewsDistribution.map(
    ([score, percentage]) => {
      if (scoresThatShouldReceiveExtraPoint.includes(score)) {
        return [score, percentage + 1]
      }

      return [score, percentage]
    },
  )

  return roundedReviewsDistribution
}

const getTotalOfReviews = (reviewsCountByScore: ReviewsCountByScore) => {
  const total = reviewsCountByScore.reduce((acc, [, count]) => acc + count, 0)

  return total
}

const getDecimalPart = (number: number, limitDecimalPlaces = 3) => {
  if (Number.isInteger(number)) {
    return 0
  }

  const decimalStr = number.toString().split('.')[1].slice(0, limitDecimalPlaces)

  return Number(decimalStr)
}

const sortReviewsDistributionByDecimals = (
  a: ScoreDistributionTuple,
  b: ScoreDistributionTuple,
) => {
  const [, percentageA] = a
  const [, percentageB] = b

  const decimalPercentageA = getDecimalPart(percentageA)
  const decimalPercentageB = getDecimalPart(percentageB)

  return decimalPercentageB - decimalPercentageA
}
