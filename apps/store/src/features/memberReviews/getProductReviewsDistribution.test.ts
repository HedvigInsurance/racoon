import { expect, test } from '@jest/globals'
import { getProductReviewsDistribution } from './getProductReviewsDistribution'
import { type ReviewComments } from './productReviews.types'

test('should return a distribution where the sum of the scores percentages equals to 100%', () => {
  // Arrange
  const reviews: ReviewComments = {
    commentsByScore: {
      5: { total: 183, latestComments: [] },
      4: { total: 247, latestComments: [] },
      3: { total: 54, latestComments: [] },
      2: { total: 0, latestComments: [] },
      1: { total: 25, latestComments: [] },
    },
  }

  // Act
  const reviewsDistribution = getProductReviewsDistribution(reviews)
  const distributionSum = reviewsDistribution.reduce(
    (acc, [, percentage]) => acc + Number(percentage),
    0,
  )

  // Assert
  expect(reviewsDistribution).toEqual([
    [5, 36],
    [4, 48],
    [3, 11],
    [2, 0],
    [1, 5],
  ])
  expect(distributionSum).toEqual(100)
})

test('should not do any rounding when percentages already sum 100%', () => {
  // Arrange
  const reviews: ReviewComments = {
    commentsByScore: {
      5: { total: 60, latestComments: [] },
      4: { total: 10, latestComments: [] },
      3: { total: 20, latestComments: [] },
      2: { total: 6, latestComments: [] },
      1: { total: 4, latestComments: [] },
    },
  }

  // Act
  const reviewsDistribution = getProductReviewsDistribution(reviews)

  // Assert
  expect(reviewsDistribution).toEqual([
    [5, 60],
    [4, 10],
    [3, 20],
    [2, 6],
    [1, 4],
  ])
})
