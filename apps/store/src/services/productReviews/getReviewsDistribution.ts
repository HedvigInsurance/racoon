import type {
  ReviewsDistribution,
  Score,
  ScoreDistributionTuple,
  ReviewComments,
} from './productReviews.types'

// It uses Largest Remainder Method (LRM) to distribute round the percetages
// https://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
export const getReviewsDistribution = (reviews: ReviewComments) => {
  // TODO: get this from DB
  const reviewsTotal = getReviewsTotal(reviews)

  const realReviewsDistribution: ReviewsDistribution = Object.entries(reviews.commentsByScore).map(
    ([score, comments]) => {
      const percentage = (comments.total / reviewsTotal) * 100
      return [score as Score, percentage]
    },
  )

  const truncatedReviewsDistribution: ReviewsDistribution = realReviewsDistribution.map(
    ([score, percentage]) => {
      const roundedPercentage = Math.trunc(percentage)
      return [score as Score, roundedPercentage]
    },
  )

  const truncatedPercentagesTotal = truncatedReviewsDistribution.reduce(
    (acc, [, percentage]) => acc + percentage,
    0,
  )
  const pointsToBeDistributed = 100 - truncatedPercentagesTotal

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
  const sortedRoundedReviewsDistribution = roundedReviewsDistribution.sort(
    sortReviewsDistributionByScore,
  )

  return sortedRoundedReviewsDistribution
}

const getReviewsTotal = (reviews: ReviewComments) => {
  const total = Object.values(reviews.commentsByScore).reduce((acc, { total }) => acc + total, 0)

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

const sortReviewsDistributionByScore = (a: ScoreDistributionTuple, b: ScoreDistributionTuple) => {
  const [scoreA] = a
  const [scoreB] = b

  return Number(scoreB) - Number(scoreA)
}
