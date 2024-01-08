import { expect, test } from '@jest/globals'
import { getReviewsDistribution, type ReviewsCountByScore } from './getReviewsDistribution'

test('it should return a distribution where the sum of the scores percentages equals to 100%', () => {
  // Arrange
  const reviews: ReviewsCountByScore = [
    [5, 83],
    [4, 47],
    [3, 54],
    [2, 0],
    [1, 25],
  ]

  // Act
  const reviewsDistribution = getReviewsDistribution(reviews)
  const distributionSum = reviewsDistribution.reduce(
    (acc, [, percentage]) => acc + Number(percentage),
    0,
  )

  // Assert
  expect(reviewsDistribution).toEqual([
    [5, 40],
    [4, 22],
    [3, 26],
    [2, 0],
    [1, 12],
  ])
  expect(distributionSum).toEqual(100)
})

test('it should not do any rounding when percentages already sum 100%', () => {
  // Arrange
  const reviews: ReviewsCountByScore = [
    [5, 60],
    [4, 10],
    [3, 20],
    [2, 6],
    [1, 4],
  ]

  // Act
  const reviewsDistribution = getReviewsDistribution(reviews)

  // Assert
  expect(reviewsDistribution).toEqual([
    [5, 60],
    [4, 10],
    [3, 20],
    [2, 6],
    [1, 4],
  ])
})

test('it should work properly when there is no comments, meaning 0% for each category', () => {
  const reviews: ReviewsCountByScore = [
    [5, 0],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0],
  ]

  const reviewsDistribution = getReviewsDistribution(reviews)

  expect(reviewsDistribution).toEqual([
    [5, 0],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0],
  ])
})
